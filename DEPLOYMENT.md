# Nesting Tree — server setup & deployment

Everything needed to take this project from a repo to a live site.
Written 28 July 2026 against the current build.

---

## 1. What this app actually is

Not a plain static site, and not a full server app either — it's mostly static
with two live routes.

| | |
|---|---|
| Framework | Astro 7 |
| Adapter | `@astrojs/node`, **standalone** mode (`astro.config.mjs`) |
| Node required | **>= 22.12.0** (`package.json` engines). Dev machine runs 24.17.0 |
| Database | MySQL, via `mysql2` connection pool |
| Prerendered pages | 12 — home, about, gallery, projects index, 6 project pages, privacy, terms |
| On-demand (SSR) routes | **2** — `/thank-you` and `POST /api/contact` |
| Build output | `dist/client` (static, 618 MB) + `dist/server` (0.4 MB) |

The two SSR routes are why you cannot deploy this as static files alone.
`/api/contact` writes enquiries to MySQL and `/thank-you` reads the
`?project=` / `?status=` query string. **A Node process must be running.**

---

## 2. Server requirements

- **Linux host** with a public IP (any small VPS is plenty — this is a
  low-traffic marketing site; 1–2 vCPU / 2 GB RAM is comfortable)
- **Node.js 22.12+** (22 LTS or 24)
- **MySQL 8.0+** (or MariaDB 10.6+) — can be on the same box
- **Nginx or Caddy** as a reverse proxy, terminating TLS
- **~2 GB free disk** — the repo plus `node_modules` plus a 618 MB build,
  with headroom for one previous build during deploys
- A domain (`nestingtree.in`) with DNS A record pointed at the server
- TLS certificate — Let's Encrypt via certbot, or automatic with Caddy

---

## 3. Environment variables

The app reads these at runtime. `src/lib/db.ts` imports `dotenv/config`, so a
`.env` file in the working directory works — but for a systemd service, prefer
real environment variables or an `EnvironmentFile`.

| Variable | Required | Default if unset | Notes |
|---|---|---|---|
| `DB_HOST` | yes | `localhost` | |
| `DB_PORT` | no | `3306` | |
| `DB_USER` | yes | `root` | **Do not use root in production** — see §4 |
| `DB_PASSWORD` | yes | `""` (empty) | |
| `DB_NAME` | yes | `nesting_tree` | |
| `HOST` | yes | `0.0.0.0` | Set to `127.0.0.1` so only the proxy can reach it |
| `PORT` | yes | `4321` | |

`.env` is correctly git-ignored (`.gitignore:17`) and is **not** in the repo.
`.env.example` is the template. Never commit real credentials.

---

## 4. Database setup

There is **no migration file in this repo** — the `leads` table has to be
created by hand. This DDL matches exactly what `src/pages/api/contact.ts`
inserts:

```sql
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
```

Two details that will bite if you get them wrong:

- **`created_at` must have `DEFAULT CURRENT_TIMESTAMP`.** The application never
  supplies it — the INSERT lists only the six content columns. Without the
  default you get zero dates on every lead.
- **Charset must be `utf8mb4`.** Enquiry messages routinely contain `—`, `·`
  and `₹`. On a `latin1` table those either mangle or throw.

Create a dedicated user rather than using root:

```sql
CREATE USER 'nesting_app'@'localhost' IDENTIFIED BY 'a-long-random-password';
GRANT SELECT, INSERT ON nesting_tree.leads TO 'nesting_app'@'localhost';
FLUSH PRIVILEGES;
```

`SELECT, INSERT` is all the app needs. It never updates or deletes.

---

## 5. Build and run

```bash
git clone <repo> /var/www/nestingtree
cd /var/www/nestingtree
npm ci                 # reproducible install from package-lock.json
npm run build          # ~5s; writes dist/client + dist/server
```

**There is no `start` script in `package.json`.** Run the built server directly:

```bash
HOST=127.0.0.1 PORT=4321 node ./dist/server/entry.mjs
```

Worth adding to `package.json` so nobody has to remember the path:

```json
"scripts": {
  "start": "node ./dist/server/entry.mjs"
}
```

### systemd unit

`/etc/systemd/system/nestingtree.service`:

```ini
[Unit]
Description=Nesting Tree website
After=network.target mysql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/nestingtree
EnvironmentFile=/var/www/nestingtree/.env
Environment=HOST=127.0.0.1
Environment=PORT=4321
Environment=NODE_ENV=production
ExecStart=/usr/bin/node ./dist/server/entry.mjs
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now nestingtree
sudo systemctl status nestingtree
```

### Nginx reverse proxy

```nginx
server {
    listen 443 ssl http2;
    server_name nestingtree.in www.nestingtree.in;

    ssl_certificate     /etc/letsencrypt/live/nestingtree.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/nestingtree.in/privkey.pem;

    # Videos are large; give uploads/streams room and let nginx serve
    # the static build directly rather than proxying it through Node.
    client_max_body_size 2m;

    location /_astro/ {
        alias /var/www/nestingtree/dist/client/_astro/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location /images/ {
        alias /var/www/nestingtree/dist/client/images/;
        expires 30d;
        add_header Cache-Control "public";
        access_log off;
    }

    location / {
        proxy_pass         http://127.0.0.1:4321;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name nestingtree.in www.nestingtree.in;
    return 301 https://$host$request_uri;
}
```

Serving `/images/` and `/_astro/` straight from nginx matters here — see §6.

---

## 6. The asset problem (read this before choosing a host)

`public/` is **617.5 MB across 213 files**, and the build copies all of it.

| Category | Size |
|---|---|
| 22 × `.mp4` background videos | **240.8 MB** |
| Two unreferenced `_og` images | **83.7 MB** |
| Everything else (photos, renders, plans) | ~293 MB |

Consequences to plan for:

- **Bandwidth is the real cost driver, not CPU.** A single visitor who hits the
  home page and two project pages can pull 30–60 MB of video. A hundred such
  visitors a day is roughly 150 GB/month. Check your host's bandwidth
  allowance before you pick a plan, and put Cloudflare (free tier is fine) in
  front to absorb repeat traffic.
- **Never proxy these through Node.** The nginx `location` blocks above serve
  them from disk. Astro's Node server can do it, but it is far slower and
  pins your single process on every video request.
- **Two files are dead weight and can be deleted right now:**
  `public/images/projects/Prithvi-Elevation_og.jpg` (44.2 MB) and
  `public/images/projects/ShikharElevationFinal_og.jpeg` (39.5 MB). Nothing in
  `src/` references either — verified by grep. Deleting them removes 83.7 MB,
  about 13% of the whole deploy, with zero visual change.
- `Prithvi2-scrub.mp4` alone is 60.5 MB. If you ever want a quick win,
  re-encoding the videos at a lower bitrate would cut the deploy substantially.

---

## 7. Known gaps to close (not blockers, but decide before or soon after launch)

### Social sharing previews — FIXED, but confirm the domain
`site: 'https://nestingtree.in'` is now set in `astro.config.mjs`, and
`BaseLayout.astro` resolves `og:image`, `og:url` and `<link rel="canonical">`
against it. Verified in the build output — all absolute.

**If the site is served from any other domain, change that one line.** Every
absolute URL on the site is derived from it; get it wrong and every share card
points at a domain that does not exist.

Purpose-built share cards live in `public/images/og/` — 1200×630, 40–110 KB
each, one per project plus `default.jpg`. They are generated, not hand-made:
the source renders are portrait (~0.75 ratio) and several have the architect's
title block baked into the bottom edge, so each card is the render scaled to
fit over a blurred, darkened copy of itself, with the caption strip cropped off.

**Do not point `og:image` at a hero render.** They are 1.5–2 MB portrait files;
WhatsApp will not render an image that large, and the title block would appear
in every shared link.

After DNS goes live, force the scrapers to re-read the tags:
- Facebook / WhatsApp: <https://developers.facebook.com/tools/debug/>
- LinkedIn: <https://www.linkedin.com/post-inspector/>

WhatsApp caches aggressively — if you share a link before DNS resolves, it can
cache the failure for days. Test with the debugger first, not by messaging
yourself.

### No robots.txt and no sitemap.xml
Neither exists. Google will still crawl the site, but a sitemap helps.
`@astrojs/sitemap` generates one automatically once `site` is set (above).

### No canonical URLs
With `site` set, adding `<link rel="canonical" href={Astro.url}>` to
`BaseLayout` prevents duplicate-content issues between `www` and apex.

### Nobody is notified when a lead arrives
This is the most important operational gap. `/api/contact` writes to MySQL and
nothing else — **no email, no SMS, no WhatsApp.** If nobody queries the `leads`
table, enquiries sit there unseen. Before launch, either:

- add an email/WhatsApp notification to `src/pages/api/contact.ts`, or
- commit to someone checking the table daily, or
- point a simple admin view at it

Whichever you choose, decide it before the first real enquiry arrives.

### The contact form has no spam protection — nginx config provided
`POST /api/contact` is a public, unauthenticated endpoint that writes a row on
every call, with no rate limit, CAPTCHA or honeypot in the application itself.
Bots find endpoints like this within days of a domain going live.

**A complete, ready-to-install nginx config is at
[`deploy/nginx-nestingtree.conf`](deploy/nginx-nestingtree.conf).** It rate
limits `/api/contact` to 5 requests/minute per IP (burst 3), rejects any method
other than POST, caps the request body at 64 KB, serves the static assets from
disk, and sets the security headers. Install:

```bash
sudo cp deploy/nginx-nestingtree.conf /etc/nginx/sites-available/nestingtree
sudo ln -s /etc/nginx/sites-available/nestingtree /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

**One gotcha:** the two `limit_req_zone` directives must sit in the `http { }`
block of `/etc/nginx/nginx.conf`, not inside `server { }`. They are at the top
of the provided file with a comment; if nginx refuses to start, that is why.

This is perimeter defence only — it protects the endpoint as long as traffic
arrives through nginx. If you later expose the Node process directly, or move
to a host that does not use nginx, the protection goes with it. An
application-level honeypot field would survive either change.

### Legal pages need a lawyer
`/privacy` and `/terms` were drafted to match what the site actually does but
have not been reviewed. Placeholders remain for the Grievance Officer's name
and the registered office address.

---

## 8. Deploy checklist

Ordered. Everything above the line must be true before the site is public.

- [ ] Node 22.12+ installed
- [ ] MySQL installed, `nesting_tree` database and `leads` table created (§4)
- [ ] Dedicated DB user created; credentials in `.env` on the server
- [ ] `npm ci && npm run build` completes clean
- [ ] systemd service running and enabled; survives `reboot`
- [ ] Nginx proxying to `127.0.0.1:4321`, static paths served from disk
- [ ] TLS certificate issued; HTTP redirects to HTTPS
- [ ] DNS A records for apex and `www` resolve to the server
- [ ] **Submit a real enquiry on the live site and confirm the row lands in `leads`** — this is the one end-to-end test that matters
- [ ] Confirm `/thank-you` renders correctly after that submission
- [ ] Someone is responsible for reading the `leads` table

---

- [ ] Delete the two unreferenced `_og` files (83.7 MB)
- [ ] Set `site` in `astro.config.mjs` and fix `og:image` (§7)
- [ ] Add `robots.txt` and a sitemap
- [ ] Decide lead notification method
- [ ] Add rate limiting to `/api/contact`
- [ ] Fill in or hide social links
- [ ] Legal review of `/privacy` and `/terms`
- [ ] Add a `start` script to `package.json`
- [ ] Set up database backups (`mysqldump` on a cron — the leads table is the
      only thing on this server that cannot be rebuilt from git)

---

## 9. Redeploying after a content change

Most edits are content in `src/data/*.ts`. The cycle:

```bash
cd /var/www/nestingtree
git pull
npm ci                       # only if package.json changed
npm run build
sudo systemctl restart nestingtree
```

The build takes a few seconds. The restart drops in-flight requests, which for
this traffic level is fine — but note the static files under `dist/client` are
replaced during the build, so run it at a quiet moment rather than mid-campaign.
