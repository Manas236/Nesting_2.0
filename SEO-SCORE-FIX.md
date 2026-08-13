# SEO score — diagnosis and fix plan

**Written 12 Aug 2026.** The owner reports the site is *"still getting a low SEO
score"* after the image rollout. This file explains why that is expected, what
is genuinely missing, and what to do about it, in order.

Companion documents — read them only where this one points you at them:
- [`IMAGE-SEO-BRIEF.md`](IMAGE-SEO-BRIEF.md) — the image work, 79/83 photographs done
- [`IMAGE-ROLLOUT-STATUS.md`](IMAGE-ROLLOUT-STATUS.md) — what that rollout parked
- [`LAUNCH-PUNCHLIST.md`](LAUNCH-PUNCHLIST.md) — everything else outstanding

---

## 0. The score cannot have moved yet

**Seven commits are sitting unpushed on `feat/inline-edit`.** Nothing from the
image rollout, and nothing from the 11 Aug punch-list sweep, is on
`nestingtree.in`. If the score was measured against the live site, it measured
the site as it was *before all of this began*.

```bash
git log --oneline @{u}..HEAD    # → 7 commits, none of them live
```

**Do not start any work in this file until that is resolved.** Either the work
ships and the score is re-measured against it, or the score is measured against
a local build (`npx astro build && npx astro preview`). Measuring the old live
site and fixing the new local one is a loop that never closes.

Deployment steps are in [`DEPLOYMENT.md`](DEPLOYMENT.md). **Pushing is the
owner's call** — do not push without being asked.

---

## 1. Which number is being fixed?

"SEO score" names at least three different things, and they measure almost
disjoint sets of facts. Establish which one before touching anything.

| Tool / number | What it actually measures | Does the image work move it? |
|---|---|---|
| **Lighthouse → SEO** (0–100) | Crawlability and machine-readability: title, meta description, `robots.txt` validity, canonical, `lang`, viewport, descriptive link text, **whether images have an `alt` attribute at all** | ❌ **No.** It checks alt *presence*, never alt *quality* — and every image already had an alt string before the rewrite. A wrong description scores the same as a right one |
| **Lighthouse → Performance** (0–100) | Load speed: LCP, CLS, total bytes | ✅ **Yes, a lot** — but only once shipped. And §4 below is now the ceiling |
| **Semrush / Ahrefs / Ubersuggest / SEO-checker sites** | Site-wide crawl: sitemap presence, structured data, internal linking, duplicate titles, thin content | ⚠️ **Partly** — these will be flagging the two things §3 fixes |

**The uncomfortable honest point.** Rewriting 79 alt strings from wrong to right
was worth doing — it is the difference between Google Images understanding your
photographs and not — but **it will not move a Lighthouse SEO score by a single
point**, because that audit only asks whether the attribute exists. If the
number being watched is Lighthouse SEO, judge the image work by Google Images
impressions in Search Console over the coming weeks, not by that gauge.

**Ask for the tool name and the actual number before optimising.** Aiming at the
wrong gauge is how an hour gets spent moving nothing.

---

## 2. What is already correct — do not "fix" these

A generic SEO checklist will tell you to add things that are already here.
Adding them twice is worse than not adding them.

| Already in place | Where |
|---|---|
| `<html lang="en">` | `BaseLayout.astro:65` |
| `<meta name="viewport">` | `BaseLayout.astro:68` |
| `<meta name="description">` per page | `BaseLayout.astro:74`, 13 of 14 pages pass their own |
| `<link rel="canonical">`, absolute | `BaseLayout.astro:75` |
| Full Open Graph set incl. absolute `og:image` | `BaseLayout.astro:77–85` |
| Purpose-built 1200×630 OG cards under ~110 KB | `/images/og/` |
| Organization JSON-LD on every page | `src/lib/structured-data.ts` |
| One `<h1>` per page, correct heading order | audited 10 Aug, see punch-list item 11 |
| `site` set for absolute URLs | `astro.config.mjs:22` |

### Two traps inside that list

**Do not "upgrade" the Organization schema to `LocalBusiness`,
`HomeAndConstructionBusiness` or `RealEstateAgent`.** Every SEO guide suggests
it; it is wrong here, and the reasoning is already written at
`structured-data.ts:21–32`. The first two are storefront types that expect a
street address, geo coordinates and opening hours — Google grades incomplete
markup as worse than none, and there is no walk-in office to publish.
`RealEstateAgent` is wrong at any address: Nesting Tree develops and sells its
own buildings, an agent brokers other people's. Upgrade the day there is a real
registered office, and add `geo` and `openingHoursSpecification` in the *same*
change.

**Do not put 2004 in `foundingDate`.** It is 2019 and only 2019 — that property
is a statement about the Nesting Tree entity. The two-decade record belongs to
K.D. Construction and is carried in the `description`, where it can be
qualified. This rule is broken repeatedly; see the long note on `brand` in
`src/data/site.ts`.

---

## 3. What is actually missing — the fix list

### C1 · `robots.txt` — missing entirely

Every crawler and every audit tool looks for it. Its absence is not fatal
(crawlers default to permissive) but it is flagged by most checkers, and it is
where the sitemap gets announced.

Create `public/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /thank-you

Sitemap: https://nestingtree.in/sitemap-index.xml
```

`/thank-you` is disallowed because a form-confirmation page has no business in
an index — see C4.

⚠️ The sitemap line must be an **absolute** URL and must match the deployed
origin. If the site is being served from a bare IP via `PUBLIC_SITE_URL`, this
file has to say so too, or generate it rather than hard-coding it.

### C2 · Sitemap — not installed

```bash
npx astro add sitemap
```

The one prerequisite is already met: `astro.config.mjs:22` sets `site`.

⚠️ **`PUBLIC_SITE_URL` is read at build time.** Build with it pointing at a
staging host and you get a sitemap full of staging URLs, submitted to Search
Console, indexing the wrong origin. Check the built `dist/client/sitemap*.xml`
before submitting anything.

Configure it to exclude `/thank-you`.

### C3 · Per-project `Residence` schema — the one that matters

**This is the highest-value item in this file**, and it is the direct payoff for
the image work. Right now the 79 rewritten descriptions are attached to nothing
a crawler reads structurally.

Nothing has been written for this. It is the unfinished half of punch-list
item 11.

**How to build it.** Extend
[`src/lib/structured-data.ts`](src/lib/structured-data.ts), which already has
the pattern to copy:

- `organizationSchema(origin)` builds the Organization node with
  `@id` = `<origin>/#organization`
- `jsonLd(data)` serialises safely (it escapes `<` so a stray `</script>` in a
  string cannot end the tag early — keep using it)

Add `residenceSchema(project, origin)` alongside it, returning a
`@type: "Residence"` node per project. Wire it through `BaseLayout.astro` — the
`Props` interface there currently takes `title`, `description`, `image` only, so
add an optional `schema` prop and emit a second `<script type="application/ld+json">`
when it is passed. Each project page passes its own.

**Rules for the node, in this repo's terms:**

- **Link it to the company** via `"provider": { "@id": "<origin>/#organization" }`.
  That `@id` already exists and is emitted on every page — reuse it, never
  restate the company's details inside the project node.
- **Absolute URLs only.** A relative `image` or `@id` is silently discarded in
  JSON-LD, not merely inadvisable. Use the `abs()` helper pattern already in
  the file.
- **`image` takes the project's gallery photographs** — this is the link
  between workstream B and a search result. Use the new `.webp` paths.
- **Read every value from `src/data/<slug>.ts`.** Do not retype an address, a
  unit count or a MahaRERA number into this file. Same rule as the Organization
  node, same reason.
- **No price, ever.** Four of the seven projects are not RERA-registered and
  cannot be advertised for sale; the site is careful about this everywhere else
  and machine-readable markup is the worst place to break it.
- **Only emit what is true.** Udaan has no storey count, no unit count and no
  drawings — it gets a minimal node or none at all. Never emit a placeholder.
- Validate every page at <https://validator.schema.org> and in Search Console's
  Rich Results Test before committing.

### C4 · `/thank-you` — no description, and should not be indexed

`src/pages/thank-you.astro` is the only page of 14 that passes no `description`
to `BaseLayout`, so it inherits the site-wide default and reads as a duplicate
of the homepage.

Two changes: give it its own short description, and add `<meta name="robots"
content="noindex, follow">`. That means adding an optional `noindex` prop to
`BaseLayout.astro`. A form-confirmation page in the index is a bad search result
for everyone.

### C5 · Meta descriptions run long

Measured in the built output: homepage **180** characters, `/about` **218**,
`/projects` **170**. Google renders roughly **155**, so the tails are being
truncated in results.

This is not a scored audit and nothing is broken — but the first 155 characters
are the ad copy for the page, and right now the sentence that gets cut is doing
work. Worth a pass. `/gallery` at 110 is fine.

---

## 4. Performance — the video problem

**The photographs are no longer the heaviest thing on this site by a wide
margin. Video is.**

Measured 12 Aug: **22 video files, 240.8 MB on disk.** Six are referenced and
autoplay in page heroes:

| File | Size |
|---|---|
| `ishaan.mp4` | 23.5 MB |
| `about.mp4` | 20.0 MB |
| `Rudrar_Backdrop.mp4` | 14.0 MB |
| `Shikhar_Backdrop.mp4` | 9.9 MB |
| `homepage_video.mp4` | 9.2 MB |
| `prithvi_backdrop.mp4` | 8.8 MB |

The photo work took 219.5 MB down to 16.9 MB. An autoplaying 23 MB hero video
gives a large part of that back on the page it sits on.

This was never in the image brief's scope and **needs an owner decision, not a
default**, because it is a design trade-off rather than a defect. The options,
cheapest first:

1. **Re-encode.** H.264 → H.265/AV1 or simply a lower bitrate and a 1080p cap.
   A 23 MB hero can usually reach 2–4 MB with no visible loss on a background
   video that is scrimmed and behind text. **Recommended — no design change.**
2. **`preload="none"` plus a poster frame.** The still loads instantly, the
   video streams after. Costs nothing visually on first paint.
3. **Drop autoplay on mobile**, poster frame only. Biggest win, and the one
   visitors on a phone would thank you for.
4. Leave it. Defensible if the hero video is the brand, but then accept that the
   Performance number has a ceiling.

The `ffmpeg` binary used for the image work is already at
`node_modules/ffmpeg-static/ffmpeg.exe` — no new tooling for option 1.

**Do not delete any video.** Several of the 22 are unreferenced and appear in
`.image-audit/dead-assets.md`, but that list also contains 80 photograph
originals that are live 301 targets. See `IMAGE-SEO-BRIEF.md` §9.

---

## 5. Order of work

| # | Task | Time | Blocked by |
|---|---|---|---|
| 0 | Establish which tool and number (§1) | — | owner |
| 0 | Ship the 7 commits, or measure locally (§0) | — | owner |
| 1 | C1 `robots.txt` | 10 min | — |
| 2 | C2 sitemap | 20 min | — |
| 3 | **C3 per-project schema** | ~1 h | — |
| 4 | C4 `/thank-you` noindex + description | 15 min | — |
| 5 | C5 description lengths | 20 min | — |
| 6 | §4 video | 1–2 h | owner decision |

C1–C4 are unambiguous and need nobody. **Start there regardless of how §1 is
answered** — every reading of "low SEO score" is improved by them.

---

## 6. Do not

1. **Do not change visible page copy.** Nothing in this file requires it. The
   image rollout touched no visible text and neither should this.
2. **Do not upgrade the Organization `@type`** (§2).
3. **Do not put 2004 in `foundingDate`** (§2).
4. **Do not add keywords meta tags.** Ignored by every major engine since 2009.
5. **Do not invent facts to satisfy a validator** — no street address, no
   opening hours, no aggregate rating, no price. A validator warning is cheaper
   than a false machine-readable claim.
6. **Do not delete anything** from `.image-audit/dead-assets.md` without
   cross-checking `src/lib/image-redirects.ts`.
7. **Do not push.** Owner's call.
8. **Do not re-litigate the image work.** 79 photographs are done and committed.

---

## 7. Verification

```bash
npx astro build

test -f dist/client/robots.txt && echo "robots ok"
ls dist/client/sitemap*.xml                       # exists, and check the origin inside
grep -c '"@type":"Residence"' dist/client/projects/*/index.html   # one per project page
grep -o 'name="robots"[^>]*' dist/client/thank-you/index.html     # noindex, follow
grep -rl "Â\|â\|Ã" src/                           # → empty (encoding, see brief §10)
```

Then, by hand:
- Every project page through <https://validator.schema.org> — zero errors
- One page through Lighthouse, and **record the before/after for the specific
  category being watched**, not the overall impression
- Confirm the sitemap's URLs point at the production origin, not a staging host

## 8. Needs the owner

1. **Which tool, and what number?** (§1)
2. **Ship the 7 commits?** Nothing improves until this happens (§0)
3. **The video decision** (§4) — this is the biggest remaining weight on the site
4. **The four parked photographs** — `IMAGE-ROLLOUT-STATUS.md`, ~15 min once chosen
5. **Dhruva's delivery year** — `dhruva.ts` says 2023, the `site.ts` journey says
   2021. Both are live. This one is a factual error on a delivered project, and
   it has been open for two days
6. **Search Console access** — without it there is no way to know whether any of
   this worked, and no baseline to compare against

---

## 9. Status — C1 to C5 are done, 12 Aug 2026

Five commits on `feat/inline-edit`, one per item, plus this section, on top of
the seven that were already unpushed. ~~**Nothing has been pushed.**~~
**All of it is pushed** as of 13 Aug 2026 — `feat/inline-edit` is level with
`origin/feat/inline-edit`.

**The one thing left on this brief is not a code change.** `/robots.txt` and
`/sitemap-index.xml` are in the build and correct, but `nestingtree.in` is still
a **parked domain** — it answers with a 114-byte redirect to `/lander` and the
parking provider's own `robots.txt`. Nothing can be submitted to Search Console
until DNS points at the server. Checked 13 Aug 2026.

| # | Commit | What landed |
|---|---|---|
| C1 | `7dffcfc` | `/robots.txt`, generated — sitemap announced absolutely |
| C2 | `aafdc51` | `@astrojs/sitemap`, 13 URLs, `/thank-you` excluded |
| C3 | `a48cd37` | **`Residence` node on 6 of 7 project pages** |
| C4 | `3477fb4` | `/thank-you`: own description + `noindex, follow` |
| C5 | `a5ec482` | 8 meta descriptions trimmed under ~155 |

### C1 — one deviation, deliberate

**It is `src/pages/robots.txt.ts`, not `public/robots.txt`.** §3 C1 asks for the
static file and then warns, in the same breath, that the `Sitemap:` line has to
match the origin the build was actually made for. `astro.config.mjs` lets
`PUBLIC_SITE_URL` move that origin at build time, and canonical and `og:image`
are both derived from it — a hard-coded origin here would have been the only
absolute URL on the site that ignored the override. The prerendered endpoint
lands at `dist/client/robots.txt` either way, so §7's `test -f` is unaffected
and nginx still serves it from disk.

### C3 — what each node carries, and what it does not

`residenceSchema(project, gallery, origin)` sits beside `organizationSchema()`
in `src/lib/structured-data.ts`, emitted through a new optional `schema` prop on
`BaseLayout` as a **second** `<script type="application/ld+json">`. Not merged
into an `@graph` with the company: the Organization block is byte-identical on
all fourteen pages and that sameness is what folds the repeats into one entity.

| Project | Node | Images | MahaRERA identifier |
|---|---|---|---|
| **Dhruva** | ✅ | 20 | `P52000033930` |
| **Rudra** | ✅ | 17 | `P52000026245` |
| **Shaurya** | ✅ | 15 | — not registered |
| **Shikhar** | ✅ | 13 | `PM1270002502760` |
| **Ishaan** | ✅ | 10 | — not registered |
| **Prithvi** | ✅ | 8 | — not registered |
| **Udaan** | ❌ none | — | — not registered |

`image` is that project's full gallery, absolute — which is the join between
workstream B and a search result, and the reason C3 was worth the hour.

**Udaan gets no node, and that is the answer, not an omission.** It is a purely
commercial building — no apartments anywhere in it, by its own page — so
`Residence` would be a false claim in the one format that is read as
authoritative. `residenceSchema()` refuses on the `commercial` flag in
`src/data/site.ts`, so the rule is enforced in code rather than remembered. The
call is still wired into `udaan.astro` and resolves to `null`, so the page reads
like its six siblings and the decision is visible where someone would look for
it.

No price and no `offers` node to hang one on. No identifier on the four
unregistered projects — `maharera` is a TBD sentinel in those data files and the
shape test rejects it, so they are silent rather than carrying an empty field.
No `geo`, no opening hours, no rating. The Organization node is untouched: still
`Organization`, still `foundingDate` 2019.

### Verification actually run

`npx astro build`, then every check in §7 except the two that need a deployed
origin:

- `dist/client/robots.txt` exists and names `https://nestingtree.in/sitemap-index.xml`
- `sitemap-index.xml` + `sitemap-0.xml`, 13 URLs, all at the production origin,
  `/thank-you` absent
- `grep -c '"@type":"Residence"'` → **1** on six project pages, **0** on Udaan
- encoding sweep over `src/` → empty
- every node parses as JSON; **all URLs absolute** (24/21/19/17/14/12 per node);
  every `url` equal to that page's `<link rel="canonical">`, trailing slash
  included; every `provider` equal to the `@id` the Organization node emits; no
  price, currency, offer or TBD placeholder anywhere in any node
- every property checked against the real schema.org vocabulary
  (`schemaorg-current-https.jsonld`): **zero unknown types or properties**
- 13 prerendered pages, 13 distinct descriptions, longest 153

**§7's `/thank-you` grep does not work as written.** The page is
`prerender = false` — it reads `?project` / `?status` — so there is no
`dist/client/thank-you/index.html`. Verified against the built Node server
instead: both states serve `noindex, follow`, and no other page serves the tag
at all.

### Parked

1. **`validator.schema.org` and the Rich Results Test on live URLs.** Both need
   a deployed origin and the site is not deployed. Checking the built markup
   against the schema.org vocabulary locally is the same check for a snippet,
   but it is not the same as Google's own read — **run both the day this
   ships**, which is the same day §0 stops being true.
2. **One accepted warning: `provider` on a `Residence`.** §3 C3 specifies it and
   it is the clearest expression of "this company develops and sells this
   building", but schema.org declares `provider` on `CreativeWork`, `Service`,
   `Action` and friends — not on a `Place`. A validator will note it on all six
   pages. The alternatives are worse: restating the company inside each project
   node, or reaching for a listing type that implies an offer and a price. Per
   §6.5, a validator note is cheaper than a false claim. Explained at the call
   site in `structured-data.ts`.
3. **The C1/C4 overlap is real but not free.** A crawler that honours
   `Disallow: /thank-you` never fetches the page and so never sees the `noindex`
   tag. Both were asked for and both are in. Today nothing links to /thank-you —
   it is behind a 303 from `/api/contact` — so neither is load-bearing on its
   own. If it ever does get linked and starts appearing as a bare URL in
   results, **drop the `Disallow` and keep the tag**, in that order.
4. **The Lighthouse before/after in §7 was not recorded.** It needs a browser
   run against a served build, and §1 is still unanswered — which number is
   being watched decides whether that measurement means anything. Note again
   that C1–C5 move the Lighthouse **SEO** gauge barely at all: it already had
   title, description, canonical, `lang`, viewport and alt attributes. What
   C1–C5 move is the crawl-based checkers in §1's third row.
5. **§4, the video.** Untouched — 240.8 MB, six autoplaying heroes, still the
   largest weight on the site and still an owner decision (§8.3).
6. **Four photographs still carry `.jpeg` paths** inside three of the
   `image` arrays — the four parked in `IMAGE-ROLLOUT-STATUS.md`. They are real
   photographs of the buildings and belong in the node; they simply have not
   been through the optimiser yet. Resolving §8.4 clears this with no schema
   change.
7. **Sitemap origin, before submitting.** `sitemap-0.xml` is built from `site`,
   which `PUBLIC_SITE_URL` overrides at build time. Open the file and read the
   origin before it goes anywhere near Search Console.

`scripts/image-audit.mjs` was already modified in the working tree when this
started and was left alone — it is not part of any of these five commits.
