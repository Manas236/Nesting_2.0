# Go-live checklist — 14 August 2026, 5:00 pm deadline

Written against the repo as it stands at **14:25 on 14 Aug 2026**, on branch
`feat/edit-auth`. Every ✅ below was checked in the code or the build, not read
off an older document. Where an older document disagrees, this file says so and
the older one is wrong.

**Updated 14:50 — §0 is done.** The working-tree fix is committed and the branch
is pushed. §0 below now records what was decided and what it leaves open;
everything from §1 down is unchanged and still stands.

**Verdict: the code is ready. One thing is not.** The finished work is now on
`origin`, but the domain is still parked. That is not a coding job; it is on the
critical path and it is inside a two-hour budget.

---

## 0. Done — the code is on `origin`, on the **branch**

Both items are closed. The choice this section left open — merge to `main`, or
push the branch and deploy from it — **was taken deliberately: push the branch,
deploy from the branch.** `origin/main` was left exactly where it was, at
`389187f`.

- [x] **Commit the working-tree change.** Done, `8d8b9d8` "Make sign-out tell
      the truth when it fails". The button now checks `res.ok` before leaving
      the page, so a failed sign-out reports the failure instead of sending you
      to the home page *looking* signed out while the cookie is still live.
- [x] **Push.** Done. `feat/edit-auth` now tracks `origin/feat/edit-auth`
      (it had no upstream at all before this). Sixteen commits went up: the
      fourteen that were stranded, the sign-out fix, and this file.

### ⚠️ The consequence, and it is now the deploy step that carries it

Pushing the branch instead of `main` moves the risk rather than removing it.
**`origin/main` still ends at `389187f` — it does not contain `ace5024` "Put the
in-page editor behind a passphrase".** DEPLOYMENT.md §9 says the server deploys
with `git pull` on `main`. Follow it literally and the site goes live with the
*pre-authentication* editor: `POST /api/content` with no cookie would be
accepted, and prices, RERA numbers and the sales phone are one request away for
any visitor who reads the page source.

- [ ] **Put `EDIT_LOGIN_SLUG`, `EDIT_PASSPHRASE` and `EDIT_SECRET` in the
      server's `.env` BEFORE deploying** — see the second ⚠️ below. This is the
      one that bites silently.
- [ ] **Deploy the branch by name**: `cd ~ && bash -n deploy.sh &&
      ./deploy.sh feat/edit-auth`. Verify by **SHA, not branch name** —
      `deploy.sh` does `git fetch --depth 1` + `git reset --hard FETCH_HEAD`, so
      it never checks a branch out and `git rev-parse --abbrev-ref HEAD` on the
      server keeps printing whatever it printed before. `git log -1 --oneline`
      is the check that means anything.
- [ ] **Change `deploy.sh`'s default branch.** Line 4 is
      `BRANCH="${1:-full-snapshot}"`. A bare `./deploy.sh`, by anyone, at any
      point, rolls the server back to `full-snapshot` — which does **not**
      contain `ace5024`. That is a live footgun for as long as the default
      stands.
- [ ] **DEPLOYMENT.md §9 describes a different host** — `/var/www/nestingtree`,
      service `nestingtree`, `git pull`. The preview box is
      `/home/ubuntu/nesting`, service `nesting`, `deploy.sh`. Reconcile the two
      before anyone deploys from the document rather than from this file.

Merging to `main` would have retired this risk outright. It was not, so
deploying the branch **by name** is a launch blocker in its own right.

The two curl checks in DEPLOYMENT.md §8 exist precisely to catch this. Run them
on the live host, not on localhost:

```bash
curl -si https://nestingtree.in/studio/wrong-slug          # must be 404
curl -si -X POST https://nestingtree.in/api/content        # must be 401
```

### ⚠️ The three `EDIT_` keys must be in `.env` *before* this deploy, not after

This is the first deploy that carries the passphrase gate, and it is the first
one whose `.env` needs `EDIT_LOGIN_SLUG`, `EDIT_PASSPHRASE` and `EDIT_SECRET`.
`.env` is git-ignored, so `git reset --hard` will not put them there and no
previous deploy has needed them.

**`npm run build` will not catch a missing key.** `/api/content` and
`/studio/[key]` are both `prerender = false`, so the build bundles them without
executing them; the `throw` at [`edit-auth.ts:60`](src/lib/edit-auth.ts#L60)
fires at *import* time, in the running Node process, on the first request that
touches a write route. `src/pages/api/content.ts` imports the same module for
its POST guard, so a missing `EDIT_SECRET` takes **`GET /api/content` down too**
and every read answers 500.

**And the deploy script's own smoke test will still say the deploy worked.** It
curls `https://43.204.250.50/`, which is prerendered and returns 200 whether or
not the editor is alive. `=== DEPLOYED ===` is not evidence. What visitors
would see is a site that renders its baked-in copy correctly with **every saved
edit silently missing**. Check the three below by hand instead:

```bash
curl -sk -o /dev/null -w 'GET  /api/content   %{http_code}\n' \
  'https://43.204.250.50/api/content?path=/'          # 200, not 500
curl -sk -o /dev/null -w 'POST /api/content   %{http_code}\n' \
  -X POST 'https://43.204.250.50/api/content'         # 401, not 500 and not 200
curl -sk -o /dev/null -w 'GET  /studio/wrong  %{http_code}\n' \
  'https://43.204.250.50/studio/wrong-slug'           # 404
```

A 500 on either of the first two means the key is not reaching the process.
`journalctl -u nesting -n 50 --no-pager` will be naming `EDIT_SECRET` if so.

`edit-auth.ts` does `import "dotenv/config"` exactly as `db.ts` does, so
whatever already delivers the `DB_*` values delivers these — they just have to
be in the file. `dotenv` reads at process start, so a key added *after* a deploy
needs `sudo systemctl restart nesting` to take.

Also on the branch and not on `main`: the branded 404 page, the 63% page-weight
cut, the asset prune, the reissued Ishaan sheets, and the standalone `/contact`
page.

---

## 1. Rate limiting — the direct answer

**Do we have it?** Yes, but in exactly one place: **nginx**. There is none in
the application.

Verified in [`deploy/nginx-nestingtree.conf`](deploy/nginx-nestingtree.conf):

| Route | Limit | Extra |
|---|---|---|
| `POST /api/contact` | 5 req/min per IP, burst 3 | non-POST methods denied, 64 KB body cap |
| `/api/edit-session` | 5 req/min per IP, burst 3 | only GET/POST/DELETE |
| `/studio/` | 5 req/min per IP, burst 3 | GET only, `no-referrer`, noindex headers |
| `POST /api/content` | 20 req/min per IP | reads deliberately unlimited |
| Everything else | 30 req/s, burst 60 | |

Returns **429**. The write-side zone keys on a `map` so the limit applies to
POSTs only — a GET evaluates to an empty key and nginx skips it, which is what
keeps `GET /api/content` open. That read runs on **every page view**
([`BaseLayout.astro:420`](src/layouts/BaseLayout.astro#L420)) and is what paints
the edited copy for the public; throttling it would break the site for visitors.

**Do we need it?** Yes, and for two separate reasons:

1. `POST /api/contact` is public, unauthenticated, and writes a MySQL row on
   every call ([`src/pages/api/contact.ts`](src/pages/api/contact.ts) — no
   honeypot, no CAPTCHA, no throttle of its own). Bots find endpoints like this
   within days of a domain resolving.
2. The editor is a **single shared passphrase**. A shared secret with no
   brute-force ceiling is not a gate. The 5/min on `/api/edit-session` is the
   ceiling. `edit-auth.ts` compares with `crypto.timingSafeEqual`, so the
   comparison itself is sound — but that only stops a timing attack, not
   guessing.

- [ ] **Install `deploy/nginx-nestingtree.conf` itself**, not the sketch in
      DEPLOYMENT.md §5 (which omits every limit above).
- [ ] **Move the four `limit_req_zone` lines and the `map` into the `http { }`
      block** of `/etc/nginx/nginx.conf`. They cannot live inside `server { }`.
      If nginx refuses to start, this is why — it is called out at the top of
      the file.
- [ ] `sudo nginx -t` passes before reload.
- [ ] **Do not use `nginx-ip-only.conf`** once the domain resolves — it sets
      `X-Robots-Tag: noindex, nofollow` and would deindex the whole site
      regardless of `robots.txt`.

**What this does not cover, and you should know it today:** this is perimeter
defence only. Expose the Node process directly, or move off nginx, and every
limit above disappears with the config. An application-level honeypot field on
the contact form (~15 minutes) would survive either change. **Not a launch
blocker** — ship behind nginx today, add the honeypot this week.

---

## 2. Done — verified today, no action needed

- ✅ **`npm run build` passes clean.** Ran it at 14:23. Prune reports
      `103 redirect keys, 103 originals deleted, 103 replacements verified
      present, 27 emptied directories removed`.
- ✅ **Sitemap is correct.** `dist/client/sitemap-0.xml` holds 14 URLs, all
      `https://nestingtree.in/`, `/thank-you` excluded. Built with
      `PUBLIC_SITE_URL` unset, which is what you want.
- ✅ **robots.txt is ours,** not the parking page's: `Allow: /`,
      `Disallow: /thank-you`, absolute `Sitemap:` line.
- ✅ **`site` is set** in `astro.config.mjs` → `https://nestingtree.in`. Every
      canonical and `og:image` derives from it.
- ✅ **SEO fundamentals, all 14 pages** — one `<h1>`, canonical, distinct meta
      description, OG + Twitter tags, `Residence` JSON-LD on the six
      residential pages. Measured from built HTML on 13 Aug.
- ✅ **Page weight cut 63%** — worst page 35 MB → 5.8 MB; deploy 644 → 319 MB.
- ✅ **404 page exists** — `src/pages/404.astro`, commit `f5c8704`. Closes
      SEO-AUDIT §4.3, which still says it is missing.
- ✅ **Editor writes are gated.** `POST /api/content`, `/api/content/revert` and
      `/api/content/history` all return 401 without a valid signed cookie.
      Reads stay open by design.
- ✅ **Editor secrets are not in the repo.** `.env` is git-ignored and holds all
      eight keys; `.env.example` carries placeholders only.
- ✅ **`EDIT_SECRET` fails loudly** if unset rather than defaulting to an empty
      HMAC key.
- ✅ **Orphan assets deleted** — 46 files, 251.9 MB, including both 40 MB+ `_og`
      files. DEPLOYMENT.md §7 still lists deleting those as a to-do; it is done.
- ✅ **Social links** — dead `#` tiles gone, Instagram is the only live profile.

---

## 3. Server bring-up — must be true before the site is public

Straight from DEPLOYMENT.md §8, with the corrections found today folded in.

- [ ] **Server at the `feat/edit-auth` tip, checked by SHA** — see §0.
      Everything below is worthless if the code is wrong, so verify it first
- [ ] Node 22.12+ installed
- [ ] MySQL installed and **`db/schema.sql` run** — see the ⚠️ below
- [ ] Dedicated DB user (`SELECT, INSERT` only); credentials in `.env` on the server
- [ ] `EDIT_LOGIN_SLUG`, `EDIT_PASSPHRASE`, `EDIT_SECRET` set in `.env` — all
      three long and random, none of them ever written into this repo
- [ ] `npm ci && npm run build` completes clean **on the server**
- [ ] `npm run build`, **never bare `astro build`** — the `postbuild` prune is
      what makes the 103 image redirects reachable
- [ ] systemd service running, enabled, survives a reboot
- [ ] nginx proxying to `127.0.0.1:4321`, static paths served from disk
- [ ] `location /images/` ends in `try_files $uri @node;` — with `=404` there,
      80+ live image URLs go dead instead of redirecting
- [ ] TLS issued; HTTP 301s to HTTPS
- [ ] DNS A records for apex **and** `www` resolve to the server

### ⚠️ DEPLOYMENT.md §4 is wrong about the database — read this

§4 opens *"There is no migration file in this repo"*. **There is:
[`db/schema.sql`](db/schema.sql).** Two consequences, both bite on launch day:

1. **§4's DDL creates only `leads`. It does not create `content_edits`.** That
   is the table the in-page editor writes to and that `GET /api/content` reads
   on every single page view. Follow §4 and every page load queries a table
   that does not exist.
2. **The two `leads` definitions disagree.** §4 says `BIGINT UNSIGNED`,
   `email VARCHAR(190)`, `source_page VARCHAR(500)`, plus two indexes.
   `db/schema.sql` says `INT`, `VARCHAR(160)`, `VARCHAR(255)`, no indexes.

**Run `db/schema.sql` — it is the one that matches the app and creates both
tables.** One real gap in it: `source_page` at `VARCHAR(255)` will silently
truncate (or, in strict mode, reject) a long `Referer`. Widen it to 500 before
you run it, or accept the truncation knowingly.

- [ ] Decide and run one schema, then `SHOW TABLES;` → **both** `leads` and
      `content_edits` present

---

## 4. End-to-end tests on the live site — the ones that actually matter

- [ ] **Submit a real enquiry and confirm the row lands in `leads`.** This is
      the single most important test on the page; nothing else exercises Node,
      MySQL and the proxy together.
- [ ] `/thank-you` renders correctly after that submission, with the right
      project render
- [ ] `curl -si https://nestingtree.in/studio/wrong-slug` → **404**
- [ ] `curl -si -X POST https://nestingtree.in/api/content` → **401**
- [ ] Sign in at `/studio/<slug>`, change one line, confirm it saves **and that
      a logged-out browser sees the change**
- [ ] Sign out, and confirm the button reports failure rather than pretending
      (the fix in §0)
- [ ] An old image URL 301s to its `.webp`:
      `curl -sI https://nestingtree.in/images/Project_Images/Dhruva/Aerial_View/DSC_0012.jpeg`
- [ ] Home page loads on a real 4G phone, not just desktop

---

## 5. The moment DNS resolves — same day

- [ ] `curl https://nestingtree.in/robots.txt` returns **our four lines**, not
      the parking provider's
- [ ] Submit `https://nestingtree.in/sitemap-index.xml` in Search Console
- [ ] Run the **Rich Results Test** on one project page. Expect one warning —
      `provider` on a `Place`. It is deliberate and documented in
      `src/lib/structured-data.ts`. **Do not "fix" it.**
- [ ] Force the scrapers to re-read the OG tags **before sharing any link**:
      - Facebook / WhatsApp: <https://developers.facebook.com/tools/debug/>
      - LinkedIn: <https://www.linkedin.com/post-inspector/>
      WhatsApp caches failures for days. Share a link before DNS resolves and
      the broken preview sticks.

---

## 6. Open, and they need the owner — not code

These have been outstanding for days. None stops the site going live; the first
two are the ones I would put in front of him this afternoon.

- [ ] **Shikhar and Prithvi addresses are wrong** — his own #6, raised 11 Aug,
      still unanswered. The cards currently print
      `Plot no. 73, Sector R2, Karanjade` and `Plot no. 277, Sector 1,
      Karanjade` — the values he called incorrect. **These go live wrong unless
      he supplies them.** Two-file edit once he does.
- [ ] **Four photographs may not be of our buildings** — `Prithvi/DSC_0093`,
      `Prithvi/DSC_0091`, `Shaurya/IMG20260627134928`, `Ishaan/DSC_0101`. They
      are on `/gallery` and three project pages, un-optimised, and they are the
      whole reason `/gallery` is still 14 MB. This is a rights question before
      it is a weight question. Answer resolves 12.7 MB either way.
- [ ] **Grievance Officer's name** — placeholder in `/privacy` §8. Indian
      privacy practice expects a named officer.
- [ ] **Ishaan unit mix** — his #14. Two of the three things it could have meant
      have changed underneath the question. Show him the page as it stands
      before asking.
- [ ] **Legal review of `/privacy` and `/terms`.** Drafted to be accurate, never
      reviewed. **Terms §3 is the clause that matters commercially** — renders
      and plans are indicative, nothing on the site is an offer, the Agreement
      for Sale prevails. Do not let anyone soften it.

---

## 7. Operational — decide today, build this week

- [ ] **Nobody is notified when a lead arrives.** `/api/contact` writes to MySQL
      and does nothing else — no email, no SMS, no WhatsApp. Pick one **today**,
      even if it is only *"Vipin checks the table every morning"*, and write the
      name down. An enquiry that sits unseen for a week is worse than a bug.
- [ ] **Database backups.** `mysqldump` on a cron. `leads` and `content_edits`
      are the only things on that server that cannot be rebuilt from git.
- [ ] **Add a `start` script** to `package.json` — there is still none. systemd
      calls the path directly so nothing breaks, but the next person will look
      for it.

---

## 8. Explicitly not blocking — after launch

- Contact-form honeypot (see §1 — nginx covers today)
- `width`/`height` on homepage and `/projects` images (CLS). 12 of 13 and 13 of
  14 declare none. Real work at every call site, not a sweep.
- Ishaan and Shaurya have no interior finishes spec — 2 amenity groups where
  peers show 3
- Ishaan's gallery is the thinnest on the site — 10 photos, 2 categories
- Ishaan's reissued sheets still print room dimensions, which his #9 took off
  every page. Baked-in pixels; only a third issue of the drawings clears it,
  and a dimension on an architect's sheet is not the page making a claim in its
  own voice
- Two apostrophe outliers (`shikhar.ts:32`, `site.ts:363`) — a 2-edit fix
  waiting on one house-style call
- Shaurya duplicates its address in `overview.facts`
- `_quarantine/` can be deleted — 326 MB, every file byte-identical to one in
  `public/images/projects/`, verified file by file

---

## The 5 pm path, in order

1. ~~Commit the studio fix, merge, push.~~ **Done at 14:50** — committed as
   `8d8b9d8` and pushed to `origin/feat/edit-auth`. What replaces it, and it is
   still step one: **three `EDIT_` keys into the server's `.env`, then
   `./deploy.sh feat/edit-auth`.** Neither `origin/main` nor `full-snapshot`
   has `ace5024`. *(§0)*
2. **Ask him for the two addresses and the four photographs.** He is the long
   pole; start him now and do the server work while you wait. *(§6)*
3. **Server: schema → `.env` → `npm ci && npm run build` → systemd → nginx →
   certbot.** Use `db/schema.sql`, not DEPLOYMENT.md §4. *(§3)*
4. **Point DNS.** Everything downstream waits on propagation, so do not leave
   it last.
5. **Run the four live checks** — enquiry lands in `leads`, wrong slug 404s,
   cookieless POST 401s, old image URL 301s. *(§4)*
6. **Search Console and the OG debuggers**, only once DNS resolves. *(§5)*
7. **Name whoever reads the leads table.** *(§7)*

If something has to give, it is §5 and §7 — those can slip to tomorrow morning
without the site being wrong. **What is left of §0 cannot slip.** The code is
pushed, but it is pushed to a branch: deploy from `origin/main` and you still
put a world-writable copy of the site on the internet.
