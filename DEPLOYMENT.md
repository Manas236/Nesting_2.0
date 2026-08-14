# Nesting Tree — server setup & deployment

Everything needed to take this project from a repo to a live site.
Written 28 July 2026. **Corrected against the repo and a real build on
14 August 2026** — §1, §4, §5, §6, §7 and §9 all carried figures or
instructions that had gone stale, and three of them (the database DDL, the
`git pull` deploy, and the missing `EDIT_` keys) would each have broken the
site on launch day. Where this file and an older document disagree, this file
is the newer one; where it and `LAUNCH-CHECKLIST-14AUG2026.md` disagree, the
checklist wins on anything about *today's* deploy.

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
| Prerendered pages | 15 — home, about, gallery, projects index, **7** project pages, contact, privacy, terms, 404 — plus generated `robots.txt` and the sitemap |
| On-demand (SSR) routes | **7** — `/thank-you`, `/studio/[key]`, and `/api/contact`, `/api/content`, `/api/content/revert`, `/api/content/history`, `/api/edit-session` |
| Build output | `dist/client` (static, **65 MB**) + `dist/server` (0.6 MB) |

*Figures re-measured 14 Aug 2026. They had drifted a long way: this table said
12 pages, 2 SSR routes and a 430 MB build, all of which predate the seventh
project, the editor and the image optimisation.*

The SSR routes are why you cannot deploy this as static files alone.
`/api/contact` writes enquiries to MySQL, `/thank-you` reads the
`?project=` / `?status=` query string, and **`GET /api/content` runs on every
single page view** to paint saved copy edits. **A Node process must be
running** — without it the site does not merely lose its forms, every page
loses its edits.

---

## 2. Server requirements

- **Linux host** with a public IP (any small VPS is plenty — this is a
  low-traffic marketing site; 1–2 vCPU / 2 GB RAM is comfortable)
- **Node.js 22.12+** (22 LTS or 24)
- **MySQL 8.0+** (or MariaDB 10.6+) — can be on the same box
- **Nginx or Caddy** as a reverse proxy, terminating TLS
- **~2 GB free disk** — the repo (328 MB of `public/` alone) plus `node_modules`
  plus a 65 MB build, with headroom for one previous build during deploys
- A domain (`nestingtree.in`) with DNS A record pointed at the server
- TLS certificate — Let's Encrypt via certbot, or automatic with Caddy

---

## 3. Environment variables

The app reads these at runtime. `src/lib/db.ts` and `src/lib/edit-auth.ts` both
import `dotenv/config`, so a `.env` file in the working directory works — but
for a systemd service, prefer real environment variables or an
`EnvironmentFile`. `dotenv` reads once at process start: a value added to
`.env` after the service is up does nothing until you restart it.

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
throws and names the variable in the message. It fails that way rather than
defaulting, because an HMAC keyed on an empty string is one anybody who has
read the repo can forge.

⚠️ **It throws at *import* time, and `src/pages/api/content.ts` imports the same
module.** So a missing `EDIT_SECRET` does not just break the editor — it takes
**`GET /api/content` down too, and that runs on every page view**, so every
page answers 500. `npm run build` will not catch it: the write routes are
`prerender = false`, so the build bundles them without executing them. Neither
will the deploy script's smoke test, which curls `/` and gets a prerendered 200
regardless. Check by hand after deploying:

```bash
curl -si localhost:4321/api/content?path=/     # 200, not 500
curl -si -X POST localhost:4321/api/content    # 401, not 500 and not 200
```

If it is 500, `journalctl -u nesting -n 50 --no-pager` will be naming
`EDIT_SECRET`. (Unit name: `nesting` on the current server, `nestingtree` on a
greenfield build — see the box at the top of §5.)

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

Change the value in `.env`, then restart the service — `sudo systemctl restart
nesting` on the current server, `nestingtree` on a greenfield build (§5). That
is all — none of the three is read at build time.

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

**Run [`db/schema.sql`](db/schema.sql). Do not hand-write the DDL.**

```bash
mysql -u root -p < db/schema.sql
```

> **Corrected 14 Aug 2026.** This section used to open *"there is no migration
> file in this repo"* and then print a hand-written `leads` table. Both were
> wrong by then: `db/schema.sql` exists, and the hand-written DDL created
> **only `leads`**. The in-page editor writes to a second table,
> `content_edits`, and `GET /api/content` reads it on **every single page
> view** — so a database built from the old §4 answers 500 on every page. The
> two `leads` definitions also disagreed on column types. `db/schema.sql` is
> the one that matches the application.

The app uses **two** tables:

| Table | Written by | Read by |
|---|---|---|
| `leads` | `POST /api/contact` | nobody yet — see §7, "nobody is notified" |
| `content_edits` | `POST /api/content`, `/api/content/revert` | `GET /api/content`, **on every page view** |

Confirm both landed:

```sql
USE nesting_tree; SHOW TABLES;   -- expect leads AND content_edits
```

Three details that will bite if you get them wrong:

- **`created_at` must have `DEFAULT CURRENT_TIMESTAMP`.** The application never
  supplies it — the INSERT lists only the six content columns. Without the
  default you get zero dates on every lead.
- **Charset must be `utf8mb4`.** Enquiry messages routinely contain `—`, `·`
  and `₹`. On a `latin1` table those either mangle or throw.
- **If `leads` already exists** from an earlier run or from the old §4 DDL,
  `CREATE TABLE IF NOT EXISTS` is a no-op and `source_page` is still whatever
  it was. Widen it: `ALTER TABLE leads MODIFY source_page VARCHAR(500);` — a
  full `Referer` with a query string overruns 255 and is either truncated
  silently or, in strict mode, rejected, losing the enquiry.

Create a dedicated user rather than using root:

```sql
CREATE USER 'nesting_app'@'localhost' IDENTIFIED BY 'a-long-random-password';
GRANT SELECT, INSERT ON nesting_tree.leads         TO 'nesting_app'@'localhost';
GRANT SELECT, INSERT ON nesting_tree.content_edits TO 'nesting_app'@'localhost';
FLUSH PRIVILEGES;
```

`SELECT, INSERT` is all the app needs — it never updates or deletes; a revert
INSERTs a new row carrying the older text. **Grant on both tables.** Granting
`leads` alone was the old §4's advice and it breaks every page view, not just
the editor.

---

## 5. Build and run

> ### ⚠️ Two hosts are described in this file. Know which one you are on.
>
> | | This section (§5) and §9's first recipe | **The box that actually serves the site** |
> |---|---|---|
> | Path | `/var/www/nestingtree` | **`/home/ubuntu/nesting`** |
> | systemd unit | `nestingtree` | **`nesting`** |
> | How code arrives | `git clone` / `git pull` | **`~/deploy.sh <branch>`** |
>
> §5 and the systemd unit below describe a **greenfield install** — follow them
> when building a host from nothing. The existing server was not built that
> way. On it, substitute the right-hand column everywhere in this document:
> `systemctl restart nesting`, `journalctl -u nesting`, and **deploy with
> `deploy.sh`, never `git pull`** — see §9.

```bash
git clone <repo> /var/www/nestingtree
cd /var/www/nestingtree
npm ci                 # reproducible install from package-lock.json
npm run build          # ~5s; writes dist/client + dist/server, then prunes
```

**Use `npm run build`, not `astro build`.** The `postbuild` script
(`scripts/prune-superseded-images.mjs`) runs automatically after `npm run build`
and is not optional — it deletes the **103** superseded image originals from
`dist/client` so the 301s in `src/lib/image-redirects.ts` can fire. Run
`astro build` on its own and those originals ship, every one of the 103
redirects goes dead, and the deploy is **264 MB** heavier — five times the size
it should be. See §5.1.

**Added 14 Aug 2026: `package.json` now has a `start` script.**

```bash
HOST=127.0.0.1 PORT=4321 npm start        # = node ./dist/server/entry.mjs
```

The systemd unit below still calls the path directly (`ExecStart=/usr/bin/node
./dist/server/entry.mjs`) and there is no reason to change it — one fewer
process in the tree, and `npm` does not forward signals as cleanly. The script
exists so nobody has to remember the path by hand.

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

103 photographs were renamed. Their old URLs are kept alive as permanent
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

Either half alone is broken: prune without the fallback turns 103 live URLs into
404s; fallback without the prune never fires. If old image URLs start returning
200 with a large JPEG, or 404, check these two first.

To confirm on the server after a deploy, from the deploy directory (§5):

```bash
# 0 expected — no superseded original left in the build
node -e 'const f=require("fs"),p=require("path");const s=f.readFileSync("src/lib/image-redirects.ts","utf8").replace(": Record<string, string> ="," =");import("data:text/javascript;base64,"+Buffer.from(s).toString("base64")).then(m=>console.log(Object.keys(m.imageRedirects).filter(k=>f.existsSync(p.join("dist/client",decodeURIComponent(k)))).length))'

# 301 expected, straight past nginx to Node
curl -sI http://127.0.0.1:4321/images/Project_Images/Dhruva/Aerial_View/DSC_0012.jpeg | head -2
```

---

## 6. Assets — re-measured 14 August 2026, and this section is now good news

> **Everything this section used to say was true in July and is not true now.**
> It described a 648 MB `public/`, a 430 MB deploy, 240.8 MB of video and two
> 40 MB `_og` files it told you to delete. The video re-encode, the image
> optimisation and the orphan-asset prune all landed between then and now. The
> old numbers would have you buy a much bigger host than this site needs, so
> they are replaced rather than annotated.

| | Measured today |
|---|---|
| `public/` in the repo | **328 MB** |
| **What actually deploys** (`dist/client`) | **65 MB** |
| Pruned out of the build by `postbuild` | 264 MB — the 103 superseded originals (§5.1) |
| 9 × `.mp4` background videos | **18.6 MB total**, largest `about.mp4` at 4.6 MB |
| Two unreferenced `_og` images | **deleted** — they are gone from `public/` |

Those 264 MB of originals stay in `public/` and in git as the only
full-resolution copies. They must never be pruned from `public/` itself.

Consequences to plan for:

- **Bandwidth is no longer the cost driver it was.** The whole deploy is 65 MB
  and the entire video set is 18.6 MB; a visitor who reads the home page and
  two project pages pulls single-digit MB, not 30–60. Any ordinary VPS
  allowance covers this. Cloudflare in front is still worth having, but it is
  now an optimisation and not a rescue.
- **Never proxy the static files through Node.** The nginx `location` blocks
  above serve them from disk. Astro's Node server can do it, but it is far
  slower and pins your single process on every request. Only a *miss* under
  `/images/` reaches Node, and then only to answer a 301 or a 404 — see §5.1.
- **Re-measure before quoting any of this again.** Every figure here has been
  wrong by an order of magnitude at some point in the last three weeks:
  `du -sh public dist/client` takes a second and settles it.

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

### Canonical URLs — DONE, verified 13 Aug 2026
This section used to read *"no canonical URLs"*. `BaseLayout` emits
`<link rel="canonical">` resolved against `site`, on all 14 indexable pages,
measured from the built HTML. Nothing to do; the `www`-versus-apex
duplicate-content risk is already closed.

### Nobody is notified when a lead arrives
This is the most important operational gap. `/api/contact` writes to MySQL and
nothing else — **no email, no SMS, no WhatsApp.** If nobody queries the `leads`
table, enquiries sit there unseen. Before launch, either:

- add an email/WhatsApp notification to `src/pages/api/contact.ts`, or
- commit to someone checking the table daily, or
- point a simple admin view at it

Whichever you choose, decide it before the first real enquiry arrives.

### Contact-form spam — honeypot added 14 Aug 2026, nginx does the rest
`POST /api/contact` is a public, unauthenticated endpoint that writes a row on
every call. Bots find endpoints like this within days of a domain going live.
There are now two layers, and they fail differently on purpose:

**In the application.** Every one of the eight enquiry forms carries an
off-screen `subject` input that no visitor sees, no keyboard reaches and no
autofill fills. `src/pages/api/contact.ts` discards any submission that arrives
with it set, before touching MySQL, and answers with the same 303 to
`/thank-you` a real enquiry gets — a bot that is told it was caught learns
which field to skip. Discards are logged as `Enquiry discarded: honeypot
filled.`, so `journalctl` says whether it is doing anything.

This layer travels with the code: it still works if the Node process is ever
exposed directly, or the host moves off nginx. Rename the field and you must
rename it in both places.

**At the perimeter.**

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

The nginx layer is perimeter defence only — it protects the endpoint as long as
traffic arrives through nginx, and the day the Node process is exposed directly
the rate limits go with the config. That is exactly why the honeypot above was
added in the application rather than left to nginx alone. Keep both: the
honeypot catches the dumb high-volume bots, the rate limit is what stops
someone hammering the *editor* passphrase, and neither substitutes for the
other.

### Legal pages need a lawyer
`/privacy` and `/terms` were drafted to match what the site actually does but
have not been reviewed. Placeholders remain for the Grievance Officer's name
and the registered office address.

---

## 8. Deploy checklist

Ordered. Everything above the line must be true before the site is public.

- [ ] **The deployed commit is the one you meant** — check `git log -1
      --oneline`, not the branch name (§9)
- [ ] Node 22.12+ installed
- [ ] MySQL installed, `db/schema.sql` run, and `SHOW TABLES;` lists **both
      `leads` and `content_edits`** (§4)
- [ ] Dedicated DB user created, granted on **both** tables; credentials in
      `.env` on the server
- [ ] `EDIT_LOGIN_SLUG`, `EDIT_PASSPHRASE` and `EDIT_SECRET` set in `.env`
      **before** the first deploy that carries the editor (§3.1) — a missing
      `EDIT_SECRET` throws at import time and takes `GET /api/content` down
      with it, so every page answers 500
- [ ] `npm ci && npm run build` completes clean **on the server**, printing
      `103 redirect keys, 103 originals deleted`
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

- [x] Delete the two unreferenced `_og` files — done; both are gone from
      `public/`, along with 46 orphan assets in total (§6)
- [x] Set `site` in `astro.config.mjs` and fix `og:image` (§7)
- [x] Add `robots.txt` and a sitemap — done 12 Aug 2026; **still to submit the
      sitemap in Search Console**, which needs the domain off its parking page
- [x] Add a `start` script to `package.json` — done 14 Aug 2026 (§5)
- [x] Add rate limiting to `/api/contact` — the config exists at
      `deploy/nginx-nestingtree.conf`; **it still has to be installed on the
      server**, which is the §7 step, not a code one
- [x] Contact-form honeypot — done 14 Aug 2026, in the application (§7)
- [x] Fill in or hide social links — dead `#` tiles removed; Instagram is the
      only live profile
- [ ] Decide lead notification method — **still open, and it is the one on
      this list that costs money if it is forgotten**
- [ ] Legal review of `/privacy` and `/terms`, and the Grievance Officer's name
- [ ] Set up database backups (`mysqldump` on a cron). Back up **both** tables:
      `leads` and `content_edits` are the only things on this server that
      cannot be rebuilt from git

---

## 9. Redeploying after a content change

Most edits are content in `src/data/*.ts`.

### On the server that actually serves the site — `deploy.sh`

```bash
cd ~
bash -n deploy.sh                  # syntax check before you run it
./deploy.sh feat/edit-auth         # ALWAYS name the branch
```

**Four things about that script, all of them things you can get wrong once:**

1. **Always pass the branch by name.** Line 4 is
   `BRANCH="${1:-full-snapshot}"`. A bare `./deploy.sh` rolls the server back
   to `full-snapshot`, which does **not** contain the passphrase gate
   (`ace5024`) — that is a live footgun until the default is changed. The
   script is not in this repo, so it has to be edited on the server.
2. **Verify by SHA, never by branch name.** It does `git fetch --depth 1` +
   `git reset --hard FETCH_HEAD`, so it never checks a branch out.
   `git rev-parse --abbrev-ref HEAD` keeps printing whatever it printed
   before, forever. `git log -1 --oneline` is the only check that means
   anything.
3. **`=== DEPLOYED ===` is not evidence.** Its smoke test curls `/`, which is
   prerendered and returns 200 whether or not Node, MySQL or the editor are
   alive. Run the three checks in §8 by hand.
4. **`.env` is git-ignored, so `git reset --hard` never delivers it.** A new
   key — the three `EDIT_` ones, on this deploy — has to be put on the server
   by hand *before* the deploy, and `dotenv` reads at process start, so a key
   added afterwards needs `sudo systemctl restart nesting`.

### On a greenfield `/var/www/nestingtree` host

```bash
cd /var/www/nestingtree
git pull
npm ci                       # only if package.json changed
npm run build
sudo systemctl restart nestingtree
```

⚠️ `git pull` here pulls **the branch that host has checked out**. `main` does
not contain the passphrase gate; deploy `main` and `POST /api/content` is
accepted with no cookie, which puts prices, RERA numbers and the sales phone
one request away from any visitor who reads the page source. Check what is
checked out before pulling.

Both paths, in common:

- `npm run build`, **never `astro build`** — the `postbuild` prune has to run
  or the renamed images' 301s go dead (§5.1). It prints its counts; expect
  `103 redirect keys, 103 originals deleted`.
- The build takes a few seconds. The restart drops in-flight requests, which at
  this traffic level is fine — but the static files under `dist/client` are
  replaced *during* the build, so run it at a quiet moment rather than
  mid-campaign.
