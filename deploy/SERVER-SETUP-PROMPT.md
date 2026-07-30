# Server setup — self-contained handoff prompt

Copy everything inside the fence below into a fresh Claude conversation
(claude.ai in Chrome). It is written to stand alone: it assumes the reader has
no access to this repository.

---

```
I need help setting up an AWS server for an existing website. Here is the full
context — please help me work through it step by step, and ask me for anything
you need (like my public IP or the server's IP) rather than guessing.

## The project

A marketing website for Nesting Tree, a residential property developer in Navi
Mumbai, India. The code is already written, builds clean, and is pushed to
GitHub. I am NOT changing the code — I need the server running.

Repository: https://github.com/Manas236/Nesting_2.0.git
Branch:     full-snapshot   (NOT main — main is older)

Stack:
- Astro 7 with the @astrojs/node adapter in "standalone" mode
- Node.js — requires >= 22.12.0 (enforced in package.json "engines")
- MySQL — used only to store contact-form enquiries
- Tailwind CSS v4

IMPORTANT — this is not a static site. Most pages are prerendered to HTML, but
two routes render on demand and need a live Node process:
  - /thank-you        (reads ?project= and ?status= query params)
  - POST /api/contact (writes enquiry form submissions to MySQL)
So I cannot host this on S3/static hosting. A Node process must stay running.

## Scale and access

- Private preview only. A handful of specific people, not the public.
- No domain name yet. I will share the server's public IP address directly.
- Traffic will be very low — a few visitors a day at most.

## The unusual constraint: the site is asset-heavy

- public/ is 617 MB across 213 files
- 240 MB of that is 22 background .mp4 videos
- A full `git clone` pulls about 1.26 GB, because the videos are committed
  and have history. A shallow clone (--depth 1) is about 650 MB.
- After building, dist/client is another ~618 MB (the assets get copied)

Plan disk and bandwidth around this. It is the main thing that makes this
project different from a normal small site.

## What I need help with

1. Which AWS option to pick, and roughly what it will cost per month
2. Creating and configuring the instance (I am on AWS, region should be
   Mumbai / ap-south-1 since all users are in Navi Mumbai)
3. Installing Node 22+, MySQL and nginx
4. Cloning the repo and building
5. Creating the database and table
6. Running the app as a service that survives reboots
7. Locking access down to only the people who should see it

## Details you will need

### Environment variables the app reads

Runtime (the app will not start correctly without these):
  DB_HOST       default localhost
  DB_PORT       default 3306
  DB_USER       default root  -- I want a dedicated user instead
  DB_PASSWORD   default empty
  DB_NAME       default nesting_tree
  HOST          set to 127.0.0.1 so only nginx can reach the app
  PORT          set to 4321

Build time only:
  PUBLIC_SITE_URL   The public origin. Because I have no domain, this must be
                    set to http://<MY_SERVER_PUBLIC_IP> when I run the build.
                    It is baked into the HTML at build time (canonical tags and
                    social-share image URLs), so if the IP changes I must
                    rebuild. If unset it defaults to https://nestingtree.in,
                    which would be wrong for now.

There is a .env.example in the repo. The real .env is git-ignored and does not
exist on the server — I have to create it.

### The database table does not exist and there is no migration

I need to create it by hand. This DDL matches exactly what the app inserts:

CREATE DATABASE IF NOT EXISTS nesting_tree
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE nesting_tree;

CREATE TABLE IF NOT EXISTS leads (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name        VARCHAR(120)  NOT NULL,
  phone       VARCHAR(30)   NOT NULL,
  email       VARCHAR(190)  NULL,
  project     VARCHAR(60)   NULL,
  message     TEXT          NULL,
  source_page VARCHAR(500)  NULL,
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_created_at (created_at),
  KEY idx_project (project)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

Two things that will break it if changed:
- created_at MUST have DEFAULT CURRENT_TIMESTAMP. The app never sends that
  column, so without the default every lead gets a zero date.
- The charset MUST be utf8mb4. The site copy is full of em-dashes, middle dots
  and rupee signs, which corrupt or error on latin1.

The app only ever SELECTs and INSERTs, so a dedicated DB user needs just:
  GRANT SELECT, INSERT ON nesting_tree.leads TO 'nesting_app'@'localhost';

### There is no "start" script in package.json

The build produces dist/server/entry.mjs. Run it directly:
  node ./dist/server/entry.mjs
It honours the HOST and PORT environment variables.

### nginx configs are already in the repo

  deploy/nginx-ip-only.conf      <- USE THIS ONE (no domain, plain HTTP)
  deploy/nginx-nestingtree.conf  <- for later, once a domain and TLS exist

The IP-only config already: rate limits POST /api/contact to 5 requests per
minute per IP, rejects non-POST methods on that endpoint, caps request bodies
at 64 KB, serves /images/ and /_astro/ directly from disk instead of proxying
618 MB of assets through Node, sets noindex headers, and enables gzip.

KNOWN GOTCHA: the two `limit_req_zone` lines at the top of that file must live
in the `http { }` block of /etc/nginx/nginx.conf, not inside `server { }`.
nginx refuses to start otherwise with a "directive not allowed here" error.

### Other things I already know are true

- There is no TLS and cannot be yet — Let's Encrypt will not issue a
  certificate for a bare IP address. Plain HTTP for now. Access control has to
  come from the AWS security group / firewall, restricted to specific IPs.
- The instance needs a STATIC ip (Elastic IP on EC2, or the static IP that
  Lightsail includes). A default EC2 public IP changes every stop/start, and
  because PUBLIC_SITE_URL is baked in at build time, a changed IP means
  rebuilding.
- Ubuntu's default apt Node package is far older than 22.12, so Node has to
  come from NodeSource or nvm.
- Nothing notifies anyone when a lead arrives. The app only writes to MySQL.
  I will need to check the leads table or add a notification later.

## Please help me with

Start by recommending which AWS product and size to use and why, with a rough
monthly cost, given the asset sizes above. Then walk me through the setup in
order. Give me exact commands I can paste, and tell me what to check after
each step so I know it worked before moving on.

The single test that proves everything works end to end: submit the enquiry
form on the live site and confirm a row appears in the `leads` table. That one
action exercises the Node process, the environment variables, the database
user's grants, the table schema and the redirect all at once.
```
