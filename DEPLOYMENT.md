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
| Build output | `dist/client` (static, 430 MB) + `dist/server` (0.4 MB) |

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
- **~2 GB free disk** — the repo (648 MB of `public/` alone) plus `node_modules`
  plus a 430 MB build, with headroom for one previous build during deploys
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
| `EDIT_LOGIN_SLUG` | yes | none | Secret path segment for the editor sign-in — §3.1 |
| `EDIT_PASSPHRASE` | yes | none | What the editor types — §3.1 |
| `EDIT_SECRET` | yes | none | HMAC key for the session cookie. **Missing = the app throws** — §3.1 |

`.env` is correctly git-ignored (`.gitignore:17`) and is **not** in the repo.
`.env.example` is the template. Never commit real credentials.

---

### 3.1 The editor sign-in

The in-page text editor (`src/scripts/inline-edit.js`) rewrites live copy —
prices, RERA numbers, the sales phone. It is behind a passphrase.

**Reads are open and must stay open.** `GET /api/content` is what paints the
edited copy for every visitor. Only the writes are gated.

#### The three variables

Generate all three as long random strings. One way:

```bash
openssl rand -base64 32 | tr -d '=+/' | cut -c1-40
```

| | What it is | Changing it |
|---|---|---|
| `EDIT_LOGIN_SLUG` | The secret second path segment. Sign-in is at `/studio/<slug>`. | `systemctl restart` — the route reads it per request, so **no rebuild** |
| `EDIT_PASSPHRASE` | What the person types into the box. | Restart. **Signs everyone out.** |
| `EDIT_SECRET` | The key the session cookie is signed with. 32+ random bytes. | Restart. **Signs everyone out.** |

`EDIT_SECRET` has no fallback on purpose: with it unset, `src/lib/edit-auth.ts`
throws on the first request to a write route or the login page and names the
variable in the message. Look in `journalctl -u nestingtree -n 50`. It fails
that way rather than defaulting, because an HMAC keyed on an empty string is
one anybody who has read the repo can forge.

**Do not write the real slug or passphrase into any file in this repo** —
not here, not in `.env.example`, not in a commit message. They live in `.env`
on the server (or the systemd `EnvironmentFile`) and nowhere else.

#### Reaching the editor

1. Open `https://nestingtree.in/studio/<EDIT_LOGIN_SLUG>`. Any other slug
   returns an ordinary 404, identical to any other 404 on the site — that is
   deliberate, so a scanner cannot tell a wrong slug from a path that was
   never a route.
2. Enter the passphrase. On success the browser is sent to `/` with the URL
   *replaced*, so the secret is not left in the address bar or the back stack.
3. Two cookies are set for seven days: `nt_edit` (signed, `HttpOnly` — the real
   credential) and `nt_edit_ui` (a hint the browser reads to decide whether to
   download the editor bundle at all; it carries no authority and the server
   never trusts it).
4. An **Edit text** button now appears on every page. A visitor without the
   cookie sees no button, no prompt, and never downloads the editor chunk.
5. Sign out from the same `/studio/<slug>` URL. A session that runs out
   mid-edit is not silent: the save is refused, the text on screen snaps back,
   and the editor tears itself off the page with a message.

The sign-in page is **not** listed in `robots.txt`, and must not be — robots.txt
is public, so a `Disallow` line for a secret path publishes it. Nothing links
to the page; it carries `X-Robots-Tag: noindex, nofollow` and
`Referrer-Policy: no-referrer` so the slug cannot travel in a `Referer` header.

#### Rotating

Change the value in `.env`, then `sudo systemctl restart nestingtree`. That is
all — none of the three is read at build time.

- Rotating **`EDIT_LOGIN_SLUG`** changes where you sign in. Anyone already
  signed in stays signed in; their cookie does not care about the path.
- Rotating **`EDIT_PASSPHRASE` or `EDIT_SECRET`** invalidates every cookie
  already issued and **signs everybody out immediately**. That is the way to
  end a session you cannot otherwise revoke — sessions are stateless signed
  tokens, so there is nothing per-person to delete (`src/lib/edit-auth.ts`
  explains why that trade was taken: an in-memory store would sign the editor
  out on every content deploy).

`deploy/nginx-nestingtree.conf` caps `/api/edit-session` and `/studio/` at
5 requests a minute per address. Keep it: a shared passphrase with no
brute-force ceiling is not a gate.

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
npm run build          # ~5s; writes dist/client + dist/server, then prunes
```

**Use `npm run build`, not `astro build`.** The `postbuild` script
(`scripts/prune-superseded-images.mjs`) runs automatically after `npm run build`
and is not optional — it deletes the 80 superseded image originals from
`dist/client` so the 301s in `src/lib/image-redirects.ts` can fire. Run
`astro build` on its own and those originals ship, every one of the 80 redirects
goes dead, and the deploy is 219 MB heavier. See §5.1.

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

**`deploy/nginx-nestingtree.conf` is the authoritative config** — copy that file
rather than the sketch below, which omits the rate limiting. Use
`deploy/nginx-ip-only.conf` while the site is on a bare IP with no domain.
Install instructions are in the header comment of each.

```nginx
server {
    listen 443 ssl http2;
    server_name nestingtree.in www.nestingtree.in;

    ssl_certificate     /etc/letsencrypt/live/nestingtree.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/nestingtree.in/privkey.pem;

    root /var/www/nestingtree/dist/client;

    # Videos are large; give uploads/streams room and let nginx serve
    # the static build directly rather than proxying it through Node.
    client_max_body_size 2m;

    location /_astro/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
        try_files $uri =404;
    }

    # A miss falls through to Node, which holds the 301s for renamed
    # images. Do not change this to =404 — see §5.1.
    location /images/ {
        expires 30d;
        add_header Cache-Control "public";
        access_log off;
        try_files $uri @node;
    }

    location @node {
        proxy_pass         http://127.0.0.1:4321;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
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

### 5.1 Renamed images: the prune and the `/images/` fallback

80 photographs were renamed. Their old URLs are kept alive as permanent
redirects — the map is `src/lib/image-redirects.ts` and `src/middleware.ts`
serves it. **Middleware only runs inside the Node process**, and nginx serves
`/images/` from disk, so this needs two things to be true at once:

1. **The superseded originals must not be in `dist/client`.** `public/` is copied
   into the build wholesale, so they would ship, and nginx would answer an old
   URL with a 200 and the original multi-megabyte JPEG — the redirect never runs.
   `scripts/prune-superseded-images.mjs` deletes them as npm's `postbuild`. It
   reads the paths out of `src/lib/image-redirects.ts` at run time and hard-fails
   if any replacement is missing, so it cannot drift from the map or strand a
   photograph. It touches `dist/client` only; `public/` keeps the only
   full-resolution copies and must never be pruned.
2. **`location /images/` must end in `try_files $uri @node;`.** With `=404` there
   instead, the pruned URLs answer 404 and the 301s are unreachable.

Either half alone is broken: prune without the fallback turns 80 live URLs into
404s; fallback without the prune never fires. If old image URLs start returning
200 with a large JPEG, or 404, check these two first.

To confirm on the server after a deploy, from `/var/www/nestingtree`:

```bash
# 0 expected — no superseded original left in the build
node -e 'const f=require("fs"),p=require("path");const s=f.readFileSync("src/lib/image-redirects.ts","utf8").replace(": Record<string, string> ="," =");import("data:text/javascript;base64,"+Buffer.from(s).toString("base64")).then(m=>console.log(Object.keys(m.imageRedirects).filter(k=>f.existsSync(p.join("dist/client",decodeURIComponent(k)))).length))'

# 301 expected, straight past nginx to Node
curl -sI http://127.0.0.1:4321/images/Project_Images/Dhruva/Aerial_View/DSC_0012.jpeg | head -2
```

---

## 6. The asset problem (read this before choosing a host)

`public/` is **648 MB**, and the build copies all of it except the 80 superseded
image originals, which `postbuild` prunes back out — 219.5 MB, leaving a 430 MB
`dist/client`. See §5.1; those originals stay in `public/` and in git as the only
full-resolution copies. The figures below predate the prune and describe
`public/`, not the deploy.

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
  pins your single process on every video request. Only a *miss* under
  `/images/` reaches Node, and then only to answer a 301 or a 404 — see §5.1.
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

### robots.txt and sitemap.xml — DONE, 12 Aug 2026
Both ship in the build. `robots.txt` is a **generated route**
(`src/pages/robots.txt.ts`), not a static file in `public/`, so its `Sitemap:`
line follows `PUBLIC_SITE_URL` instead of hard-coding the origin — see
`SEO-SCORE-FIX.md` §9. `@astrojs/sitemap` writes `sitemap-index.xml` +
`sitemap-0.xml` (14 URLs, `/thank-you` excluded).

⚠️ **Read the origin inside `dist/client/sitemap-0.xml` before submitting it to
Search Console.** Build with `PUBLIC_SITE_URL` set and you get a sitemap full of
that host's URLs — submitting it asks Google to index the staging host.

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
- [ ] `EDIT_LOGIN_SLUG`, `EDIT_PASSPHRASE` and `EDIT_SECRET` set in `.env` (§3.1)
- [ ] `npm ci && npm run build` completes clean
- [ ] systemd service running and enabled; survives `reboot`
- [ ] Nginx proxying to `127.0.0.1:4321`, static paths served from disk
- [ ] `location /images/` ends in `try_files $uri @node;` and an old image URL
      301s to its `.webp` (§5.1)
- [ ] TLS certificate issued; HTTP redirects to HTTPS
- [ ] DNS A records for apex and `www` resolve to the server
- [ ] **Submit a real enquiry on the live site and confirm the row lands in `leads`** — this is the one end-to-end test that matters
- [ ] Confirm `/thank-you` renders correctly after that submission
- [ ] `curl -si https://nestingtree.in/studio/wrong-slug` returns **404**, and
      `POST /api/content` with no cookie returns **401** — the two checks that
      say the copy is not world-writable
- [ ] Sign in at `/studio/<slug>`, change one line, confirm it saves and that a
      logged-out browser sees the change
- [ ] Someone is responsible for reading the `leads` table

---

- [ ] Delete the two unreferenced `_og` files (83.7 MB)
- [ ] Set `site` in `astro.config.mjs` and fix `og:image` (§7)
- [x] Add `robots.txt` and a sitemap — done 12 Aug 2026; **still to submit the
      sitemap in Search Console**, which needs the domain off its parking page
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

`npm run build` here, never `astro build` — the `postbuild` prune has to run or
the renamed images' 301s go dead (§5.1). It prints its counts; expect
`80 redirect keys, 80 originals deleted`.
