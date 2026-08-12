# Image SEO — working brief

**Written 11 Aug 2026 for the session that does the work.** This file exists so
that session does not have to re-derive any of it. Everything here was measured
or decided on 11 Aug; nothing is guesswork unless it says so.

**Goal, in the owner's words:** *"I want my pages' images to actually rank on
Google and internet basically."*

This supersedes punch-list **item 12** ("Image filenames and alt text"), which
described only half the job. Item 12 in
[`LAUNCH-PUNCHLIST.md`](LAUNCH-PUNCHLIST.md) still holds the prep-work notes and
the hazard list; this file holds the plan.

---

## 0. Read this first

Three workstreams. **Do them in this order** — the order is the point of this
document, because the obvious job (renaming, descriptions) is not the one with
the most ranking in it.

| | Workstream | Why it ranks | Effort |
|---|---|---|---|
| **A** | **Shrink the images and serve them properly** | Page speed is a ranking factor and a 4 MB photo in a thumbnail grid destroys it. Nothing else works properly underneath a slow page | ~2–3 h |
| **B** | **Real filenames + real descriptions** | Filename and `alt` are the two direct signals Google reads about an image. This is the job that was originally asked for | ~2 h |
| **C** | **Tell Google the images exist** — sitemap, `robots.txt`, image schema | Discovery. Without it, indexing is left to luck | ~1 h |

**Do A and B in a single pass.** Shrinking rewrites every file anyway, and
converting to WebP changes the extension — which *is* a rename. Doing them
separately means renaming everything twice and writing the redirect map twice.
This is the single biggest efficiency in the whole plan.

**Already decided — do not re-ask the owner:**
- Filenames: rename, and update every reference (§3.1)
- Old URLs: 301 redirects, keep them permanently (§3.2)
- Alt text: formula and length in §3.3, per-category templates in §5

**Never do:** §6. Read it. It is short and two of the rules are non-negotiable.

---

## 1. Where things stand — measured 11 Aug 2026

| Fact | Value | Consequence |
|---|---|---|
| Media referenced from `src/` | **363.9 MB across 158 files** | Enormous for a brochure site |
| Files over 500 KB | **113** | |
| Largest photo | `Dhruva/Aerial_View/DSC_0012.jpeg` — **4.3 MB**, 3264×2448 | Served at full size into a thumbnail grid |
| Largest file overall | `ishaan.mp4` — **23.5 MB** | Hero video, autoplaying |
| `astro:assets` / `<Image>` used | **Nowhere** | Zero build-time optimisation: no WebP/AVIF, no resizing, no `srcset` |
| `width`/`height` on gallery `<img>` | **None** | Layout shift as images load — a Core Web Vitals penalty |
| `sitemap.xml` | **Does not exist**; `@astrojs/sitemap` not installed | |
| `robots.txt` | **Does not exist** | |
| Unreferenced files under `public/images` | **81 files, 262 MB** | Dead deploy weight. Listed in `.image-audit/dead-assets.md` |
| Alt strings in `src/data/*.ts` | **86** — 83 project photos, 3 protected stock | |
| Literal `alt=` in `.astro` files | **4**, two of them correctly empty | Almost all alt text is data-driven |

**The alt text is wrong, not just duplicated.** Spot-checked on 11 Aug: the nine
Dhruva photographs that all read *"Dhruva — aerial view over the rooftop and
surroundings"* are not aerial views of a rooftop. They are views across the Navi
Mumbai International Airport site — runway, taxiway, terminal building,
perimeter road with trucks, hills behind. Assume the other duplicate clusters
are equally unreliable and **look at every photograph before describing it.**

---

## 1a. Rollout status

**Workstreams A and B are complete for all seven projects, 12 Aug 2026.**
Full write-up, including everything that needs the owner:
[`IMAGE-ROLLOUT-STATUS.md`](IMAGE-ROLLOUT-STATUS.md) — read that first.

| Project | Photos | Migrated | State |
|---|---|---|---|
| **Dhruva** | 20 (+1 plate) | 21 | ✅ pilot. 55.3 MB → 3.7 MB |
| **Shikhar** | 13 | 13 | ✅ `47ae74b`. 37.3 MB → 3.0 MB |
| **Rudra** | 17 | 17 | ✅ `0166d69`. 46.5 MB → 3.8 MB |
| **Shaurya** | 15 | 14 | ✅ `b125138`. 36.4 MB → 2.8 MB. **1 parked** |
| **Ishaan** | 10 | 9 | ✅ `281d91c`. 23.2 MB → 2.1 MB. **1 parked** |
| **Prithvi** | 8 | 6 | ✅ `7e895a4`. 20.9 MB → 1.5 MB. **2 parked** |
| Udaan | 0 | — | nothing built yet |
| **Total** | **83** | **80** | **219.5 MB → 16.9 MB, 92.3% off** |

What a gallery grid downloads on first paint went from 219.5 MB to **3.5 MB**,
because the grid now takes the 640 px companion and only the lightbox opens the
full size. Eighty 301s live in `src/middleware.ts`.

**Four photographs are parked and need a decision.** Each is captioned
"&lt;Project&gt; — exterior of the building" and each is a real third-party
building: the Vadghar gram panchayat office (Shaurya), the M PA SC College
gateway (Ishaan), and a roadside temple, twice (Prithvi). No honest description
can also carry the `— <project>, Karanjade` tail §3.3 requires, so they were
left exactly as found. Options are in the status file. **Until they are
resolved, §11's camera-dump check finds those four paths and its uniqueness
check finds the one temple pair — both expected, nothing else in §11 has an
exception.**

Still open, and now more urgent than when the pilot flagged it:

- **Floor plans and unit renders, every project, untouched.** Dhruva alone has
  8.31 MB of them and is the worst case precisely because its photographs are
  now under 1 MB on first paint. Line art with dimension text; lossy WebP is the
  wrong tool and squeezing them is a legibility decision, so they want their own
  pass with a read-the-numbers check.
- **Two bugs in `scripts/image-audit.mjs`**, both found during the rollout and
  neither fixed: `rename-map.tsv` silently drops any filename containing a
  parenthesis (three files affected), and the dead-assets list now holds 101
  entries of which 80 are live 301 targets. Details in the status file §4.
- **Workstream C has not been started.**

## 2. The prep that already exists

`node scripts/image-audit.mjs` regenerates all of it into `.image-audit/`
(gitignored). It reads `src/` and `public/` and **writes to neither**.

| Path | What it is |
|---|---|
| `.image-audit/sheets/sheet-01…14.png` | All 83 photographs, 6 per sheet, **worst-first** — the most-duplicated descriptions come first |
| `.image-audit/WORKLIST.md` | One row per alt string: index, sheet, cell, duplicate count, current alt, exact file + line, empty `New alt` column |
| `.image-audit/worklist.tsv` | Same, tab-separated |
| `.image-audit/dead-assets.md` | The 81 unreferenced files |
| `.image-audit/rename-map.tsv` | Proposed old→new filename map. **Proposal only, never applied** |

**Why contact sheets.** An image costs tokens by pixel area. 83 photographs
opened one at a time is ~124k tokens. Tiled six-up at 1380×690 — just under the
size where an image starts being downscaled — the same 83 cost **~19k**, about
210 each, because a sheet bills as one image. Each cell carries its worklist
index burned into the top-left corner.

**Verify the mapping before trusting it.** Open `sheet-01.png`, confirm cell 1
is the file in row 1 of the worklist. If that holds, the rest holds.

---

## 3. Decisions already made

### 3.1 Filename convention

```
/images/projects/<slug>/photos/<slug>-<subject>-<nn>.<ext>
```

Worked examples:

```
/images/Project_Images/Dhruva/Aerial_View/DSC_0012.jpeg
  → /images/projects/dhruva/photos/dhruva-aerial-view-01.webp

/images/Project_Images/Shikhar/Interior/IMG20260627131512.jpeg
  → /images/projects/shikhar/photos/shikhar-interior-01.webp

/images/Testimonials/Karthik_S_Salian.jpeg
  → /images/testimonials/karthik-s-salian.webp
```

Rules: lower-case, hyphens only, no underscores, no spaces, no `%20`. Two-digit
sequence. `.jpeg` → `.jpg` where a JPEG is kept.

**Locality is deliberately NOT in the filename.** `shikhar-aerial-view-03.jpg`,
not `shikhar-aerial-view-karanjade-panvel-03.jpg`. Google's own guidance asks
for descriptive filenames, not keyword-loaded ones, and repeating
"karanjade-panvel" 83 times reads as stuffing to a human and probably to a
classifier. The locality belongs in the alt text and in the page copy, which is
where Google reads context anyway. If you disagree, change it in
`scripts/image-audit.mjs` and re-run — but change it once, at the top, not
per-file.

### 3.2 Redirects

**Every renamed file gets a permanent (301) redirect from its old URL, kept
indefinitely.** A 301 passes ranking signals — that is what it is for — so this
costs nothing in SEO terms. It is there to keep two things alive: links already
shared, and the Open Graph cards WhatsApp and Facebook have **already cached**
for `/images/og/*`.

**Redirects live in `src/middleware.ts`, NOT in `astro.config.mjs`.** Settled by
the Dhruva pilot, 12 Aug 2026: with `output` unset, the config-level `redirects`
map writes a static meta-refresh HTML file at a `.jpeg` URL and answers **200**,
which is not a redirect at all — an image request would receive HTML. Middleware
issues a real 301 with a `Location` header. Generate the map from
`rename-map.tsv` — do not hand-write 81 entries. Twenty-one entries are already
in place for Dhruva; append, do not replace.

Owner's note, 11 Aug: *"i would prefer we rename files and all of their
references as well … so yeah forwarding is needed, but if this hurts my SEO then
we must think of something else."* It does not hurt. Proceed.

### 3.3 Alt-text formula

```
<what is actually visible> — <project name>, <locality>
```

- **80–125 characters.** Under 80 is usually too thin to be useful; over 125 is
  padding.
- **Lead with what is in the frame**, not with the project name. The description
  is the point; the branding is the tail.
- **Every one unique.** If two are identical, at least one is wrong.
- Never open with "Image of", "Photo of", "Picture showing".
- Name the project once. Name the locality once, and only where it is genuinely
  part of the scene.

Good:
> `Rooftop terrace with parapet wall and overhead water tank, looking across low-rise rooftops to the hills — Rudra, Karanjade`

Bad — the current state:
> `Dhruva — aerial view over the rooftop and surroundings`
> (nine times, and not what the photographs show)

Bad — stuffed:
> `Best luxury 1BHK flats in Karanjade Panvel Navi Mumbai near airport Dhruva Nesting Tree`

### 3.4 Out of scope, permanently

The three images in `home.intro.images` (`/images/bridge/*`) are **licensed
Unsplash stock**. Standing rule, in that file's own comment: alt describes only
what is visible and says "stock photograph", never a name, project or year,
because those are not our buildings and not our residents. **Do not rename them
into project filenames and do not rewrite their alt into project captions.**
They are listed in `WORKLIST.md` under "Out of scope" so nobody thinks they were
missed.

---

## 4. Project cheat sheet

**This table is the main reason this file exists.** Writing 83 descriptions
needs this context, and re-deriving it means reading seven data files of 350–560
lines each. Read this instead.

| Slug | Name | Status | Structure | Mix | Address | MahaRERA |
|---|---|---|---|---|---|---|
| `shikhar` | Shikhar | Ongoing · bookings open | G+10 | 66 units — 37 × 1BHK, 18 × 1RK, 3 × 1BHK+terrace, 8 shops | Plot 73, Sector R2, Karanjade, Panvel 410206 | PM1270002502760 |
| `prithvi` | Prithvi | Under construction · pre-launch | G+7 | 31 units — 26 × 1BHK, 1 × 2BHK, 4 shops | Plot 277, Sector 1, Karanjade, Panvel 410206 | none (CC only) |
| `ishaan` | Ishaan | Under construction · pre-launch | G+4 | 12 units, all 1RK, 3 per floor (1st–4th), no shops | Plot 123, Sector 1, Karanjade, Panvel 410206 | none (CC only) |
| `udaan` | Udaan | In approvals | TBA | Purely commercial, no ground-floor shops | Plot 122A, Sector R1, Karanjade, Panvel 410206 | none |
| `rudra` | Rudra | Delivered | G+4 | 20 homes + 4 shops, 5 per floor | Plot 166, Sector R2, Karanjade, Panvel 410206 | P52000026245 |
| `dhruva` | Dhruva | Delivered | G+4 (R+C) | 24 homes + 6 shops | Plot 104, Sector R3, Karanjade, Panvel 410206 | P52000033930 |
| `shaurya` | Shaurya | Delivered · sold out | G+4 | 8 homes, corner plot, 1 lift, no shops | Plot 74, Sector R2, Karanjade, Panvel 410206 | none (CC & OC) |

Distinguishing features worth naming in a description, where visible:

- **Shikhar** — tallest building in the neighbourhood; 3 lifts + 1 stretcher
  lift; rooftop gym; corner plot
- **Prithvi** — corner plot; street-level retail; **one** lift; rooftop common
  terrace. **No rooftop solar** — removed 11 Aug 2026, do not describe any panel
  you think you see
- **Ishaan** — corner plot on an 11 m and a 9 m road; purely residential
- **Rudra / Dhruva / Shaurya** — delivered and occupied; describe them as
  finished buildings, never as under construction
- **Udaan** — nothing is built. If a photo appears here it is a placeholder

⚠️ **One unresolved contradiction — do not put a year in any Dhruva alt text.**
`dhruva.ts` heroStats says **"2023 Delivered"**; the journey timeline in
`site.ts` says Dhruva was delivered in **2021**. Both are on the live site. Ask
the owner which is right; until then, no years.

---

## 5. Vocabulary and per-category templates

**Fixed vocabulary** — use these exact forms so 83 strings read as one voice:

| Use | Not |
|---|---|
| Karanjade *(alone, in the alt tail)* | Karanjade, Panvel — see ruling below |
| Karanjade, Panvel *(in prose and addresses only)* | Panvel / Karanjade Panvel / Karanjade village |
| Navi Mumbai | NaviMumbai / Mumbai |
| Navi Mumbai International Airport | NMIA / the airport (on first use) |
| 1BHK, 1RK, 2BHK | 1 BHK, one-bhk, 1-BHK |
| lift | elevator (the site's copy says "lift"; `amenityGroups` says elevator — follow the page you are on) |
| rooftop terrace | terrace garden / sky lounge |

**RULING, 12 Aug 2026 — this section contradicted itself and now does not.**
The vocabulary table originally said "Karanjade, Panvel" while every template
below ended `— <project>, Karanjade`. The Dhruva pilot followed the templates,
which was the right call: **the alt tail is `— <project>, Karanjade`.** Panvel
is already in the page's address, the hero and the page copy, so repeating it in
all 83 strings is padding rather than signal. Use the fuller "Karanjade, Panvel"
in prose, never in the tail. The 20 Dhruva strings stand as written.

**Category counts, so effort can be planned** — Exterior 28, Aerial view 28,
Corridor 6, Parking 5, Interior 5, Rooftop 3, Lobby 3, Lift 3, Entrance 2.

Templates. The `<…>` slots must be filled from the photograph, not from the
template:

- **Aerial view** — `<what the view looks over: runway, rooftops, hills, road> seen from the <project> rooftop — <project>, Karanjade`
- **Exterior** — `<elevation/angle, and what is visible: balconies, colour, ground-floor shops, compound> — <project>, Karanjade`
- **Interior** — `<room and what is in it: flooring, window, kitchen platform, fittings> in a <unit type> — <project>`
- **Lobby / Entrance** — `<what is visible: lift doors, letterboxes, tiling, gate> at the entrance — <project>, Karanjade`
- **Corridor** — `<width, light, flooring, railing> common corridor on a typical floor — <project>`
- **Parking** — `<covered/open, two-wheeler/car, columns> parking at ground level — <project>`
- **Lift** — `<car interior or landing, doors, finish> — <project>`
- **Rooftop** — `<parapet, water tank, open deck, what is around> rooftop — <project>, Karanjade`

**Twenty-eight "Aerial view" and 28 "Exterior" is where the duplication lives.**
Those 56 are more than two-thirds of the job. They are also the ones currently
described wrongly. Budget accordingly.

---

## 6. Guardrails — do not break these

1. **Describe the photograph.** Alt text that does not match the image is the
   defect being fixed; do not replace one wrong description with a different
   wrong description. If a photograph is unclear, say less rather than
   inventing — an honest short description beats a confident wrong one.
2. **Never stuff keywords.** One project name, one locality, no adjective
   stacking. "Luxury", "premium", "best", "affordable" do not go in alt text.
3. **No claims that cannot be backed.** No distances or travel times to the
   airport or the expressway. No RERA status. No prices, no carpet areas. Four
   of the seven projects are not RERA-registered and the site is careful about
   this everywhere else.
4. **Stock photography is out of scope** (§3.4).
5. **Do not touch `home.intro.images` alt text**, even to "improve" it.
6. **Hidden text must be corroborated on screen.** Same rule as punch-list item
   11: alt text that describes things not visible on the page is cloaking.
7. **Delivered projects are finished.** Rudra, Dhruva and Shaurya must never be
   described as under construction, even if a photo shows scaffolding.

---

## 7. Procedure — workstreams A and B, one pass

### Step 1 — regenerate and verify
```
node scripts/image-audit.mjs
```
Open `.image-audit/sheets/sheet-01.png`. Confirm cell 1 matches row 1 of
`.image-audit/WORKLIST.md`. Do not proceed until that is confirmed.

### Step 2 — write the descriptions
Work the sheets in order. For each cell, write the new alt into the `New alt`
column of `worklist.tsv`. Use §3.3 and §5. Sheets are ordered worst-first, so if
the session runs short, stop at a sheet boundary and the worst is already fixed.

### Step 3 — build the new files
For each photo: resize, convert, write to the new path from §3.1. `ffmpeg` is
already available at `node_modules/ffmpeg-static/ffmpeg.exe` — no new tooling.

Suggested targets (confirm against the largest rendered size in
`ProjectGallery.astro` before committing to them):

| Purpose | Long edge | Format |
|---|---|---|
| Gallery thumbnail | 640 px | WebP q≈80 |
| Gallery lightbox / full view | 1600 px | WebP q≈82 |
| Hero / elevation render | 2000 px | WebP q≈85 |
| Open Graph card | 1200×630 | JPEG q≈85 (some scrapers still dislike WebP) |

A 4.3 MB 3264×2448 JPEG at 1600 px WebP lands around 150–250 KB. That is the
workstream-A win: roughly **95% off**, on 113 files.

**Keep the originals.** They are in git history, so they are recoverable — but
confirm that before deleting anything, and do not delete in the same commit as
the rename.

### Step 4 — update every reference
Paths live in `src/data/*.ts` as plain strings. Update them from the rename map,
not by hand.

⚠️ Read §10 before writing any script that rewrites these files.

### Step 5 — markup
Add `width`, `height`, and `srcset` to the gallery `<img>` tags, and
`loading="lazy"` + `decoding="async"` to everything below the fold. `width` and
`height` are what stop the layout shifting as images load; they are cheap and
they are currently missing everywhere.

The alternative is moving images into `src/assets/` and using `astro:assets`,
which does all of this automatically. It is the more "correct" fix, but it means
converting every path string in `src/data/*.ts` into a module import — a much
bigger change to the data model. **Recommendation: pre-optimise with ffmpeg and
keep the files in `/public`.** Less churn, same result for the user.

### Step 6 — redirects
Generate `redirects` entries in `astro.config.mjs` from `rename-map.tsv`. Old
URL → new URL, permanent. Test three by hand, including one with a `%20` in it.

### Step 7 — verify
See §11.

---

## 8. Procedure — workstream C, discovery

1. **`robots.txt`** in `public/`, allowing everything and pointing at the
   sitemap.
2. **Sitemap** — `npx astro add sitemap`. The one prerequisite is already met:
   `astro.config.mjs:22` sets
   `site: process.env.PUBLIC_SITE_URL || 'https://nestingtree.in'`. Note the env
   override — if `PUBLIC_SITE_URL` is set to a staging host at build time, the
   sitemap will be generated full of staging URLs. Check it before submitting
   anything to Search Console.
3. **Per-project schema.** This is punch-list item 11's unfinished half —
   `Residence` or `Product` nodes on the seven project pages, sharing the
   existing Organization node by its `@id`
   (`https://nestingtree.in/#organization`). Build it in
   [`src/lib/structured-data.ts`](src/lib/structured-data.ts), which already
   exists and already emits the Organization node site-wide.
   **Attach the project's images to that node** — this is the direct link
   between workstream B and search results, and it is why C should not be
   skipped.
4. Submit the sitemap in Google Search Console and request re-indexing of the
   project pages.

---

## 9. Dead assets — a free win

⚠️ **This list grows as the rollout proceeds, and the new entries are NOT junk.**
It went from 81 files to 101 the moment Dhruva was migrated, because the 20
original Dhruva photographs are now referenced by nothing — they are retained
deliberately (§7 step 3) and every one of them is the target of a 301. **Do not
delete anything whose path appears on the left-hand side of `rename-map.tsv` or
in the middleware redirect map.** Cross-check before deleting, every time.

`.image-audit/dead-assets.md` listed **81 files, 262 MB** before the rollout
began. The top entries are unused video and oversized OG variants:

| File | Size |
|---|---|
| `Prithvi2-scrub.mp4` | 62 MB |
| `Prithvi-Elevation_og.jpg` | 45 MB |
| `ShikharElevationFinal_og.jpeg` | 40 MB |
| `Prithvi2.mp4` | 19 MB |

⚠️ **Confirm before deleting.** The scan only reads `src/`. A file could be
reached from somewhere it does not look — an email template, a social post, an
external link, or the database behind the live editor. A quick look at
[`src/lib/editable.ts`](src/lib/editable.ts) suggests that editor handles text
only, but that was a quick look and it has not been verified properly. **Verify
it before deleting anything**, and delete in its own commit.

---

## 10. Traps in this repo

Both of the first two cost real time on 11 Aug 2026. They are not hypothetical.

1. **Mixed line endings.** `src/data/*.ts` are **CRLF**; `src/pages/**/*.astro`
   are **LF**. A regex ending `;\n` matches the pages and silently matches
   nothing in the data files. Always write `\r?\n`, and check the substitution
   count rather than trusting it worked.
2. **Do not put a non-ASCII character in a `perl -0777` replacement.** These
   files are full of `—`, `·`, `×`, `₹`. Perl reads them as bytes; introducing
   one wide character upgrades the whole string and re-encodes every existing
   byte, double-encoding the entire file (`—` becomes `â€”`). Either keep
   replacements pure ASCII, or set explicit `:raw` I/O and handle encoding
   deliberately. After any bulk pass:
   `grep -rl "Â\|â\|Ã" src/` — it must return nothing.
3. **`/Testimonials/` → `/testimonials/` is a case-only rename.** On this
   filesystem git will not record it without a two-step `git mv` via a temporary
   name.
4. **`%20` in paths.** At least one gallery entry is URL-encoded
   (`IMG20260627122601%20(1).jpeg`). Decode before touching the filesystem;
   `scripts/image-audit.mjs` already does.
5. **`features.areaStats` in `site.ts`** is a live kill switch for every
   carpet-area grid. Unrelated to images — do not flip it while doing this work.
6. **~~Nothing is committed~~ — resolved 12 Aug 2026.** The three interleaved
   layers (an earlier SEO pass, the 11 Aug punch-list sweep, the Dhruva image
   pilot) were banked as one commit, `7e4c288 checkpoint: work in progress
   before image rollout`, because four files carried changes from more than one
   layer and could no longer be separated. Each project of the rollout is then
   its own commit on top. **Nothing has been pushed**, and the branch is still
   `feat/inline-edit`.

7. **The contact sheets silently dropped a frame, and now cannot.** Fixed
   12 Aug: one PNG among 82 JPEGs produced a thumbnail of a different size and
   pixel format, the tile filter dropped it, and every sheet after it shifted by
   one cell — while the burned-in index stayed correct, so the sheets looked
   right and the worklist's sheet/cell columns were what lied. The filter chain
   now pins `format=yuvj420p` with an even cell height, and two guards abort the
   script: one if the thumbnails are not all identical in shape, one if the
   sheet count does not account for every photo. **Navigate by the burned-in
   index regardless** — it has always been the authoritative number.

---

## 11. Definition of done

Workstream B is done when:
```bash
# every alt is unique
grep -rhoE 'alt: "[^"]*"' src/data/ | sort | uniq -d          # → empty
# nothing double-encoded
grep -rl "Â\|â\|Ã" src/                                        # → empty
# no camera dumps left in referenced paths
grep -rE '/(DSC_|IMG[0-9])' src/data/                          # → empty
npx astro build                                                # → passes
```

Workstream A is done when no referenced image exceeds ~300 KB (check with the
weighing snippet in §1's method), every gallery `<img>` has `width` and
`height`, and the build passes.

Workstream C is done when `/sitemap-index.xml` and `/robots.txt` are served, and
each project page carries a `Residence` node linked to the Organization `@id`.

**Then update [`LAUNCH-PUNCHLIST.md`](LAUNCH-PUNCHLIST.md) item 12** — move what
is finished into "Cleared since launch" and leave the rest accurately described.

---

## 12. Still needs the owner

1. **Dhruva's delivery year** — 2021 or 2023? Both are on the live site (§4). No
   Dhruva alt text should carry a year until this is settled.
2. **Search Console access**, or a screenshot of current image impressions. It
   would confirm the assumption in §3.2 that there is no ranking equity to lose,
   and give a baseline to measure against afterwards.
3. **Deleting the 81 dead files** (§9) — confirm none is used off-site.
4. **Photograph gaps**, already on the punch list as item 2: Ishaan's gallery is
   the thinnest on the site — 10 photos in 2 categories, no aerial, entrance,
   lift, parking or rooftop shots. No amount of alt text fixes a missing
   photograph, and Ishaan is a pre-launch project that needs to sell.
