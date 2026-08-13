# SEO audit — 13 August 2026

**Verdict: GO, once DNS points at the server.** Nothing in the code blocks
launch. Everything below was measured, not assumed.

---

## 0. How this was measured

Every figure in this file was read out of **`dist/client`, the built HTML** —
not the source, and not a third-party checker's summary. A script parsed all
fourteen prerendered pages for titles, descriptions, canonicals, Open Graph,
heading counts, JSON-LD, every `<img>` and `<video>` and the byte size of the
file each one points at, then resolved every internal link against the build.

That distinction matters. The previous round of advice came from a tool reading
*rendered page text*, which cannot see `<head>` at all — which is why it
reported a missing meta description that had been there since 12 August.

Re-run it any time: the script is in the scratchpad for this session, and the
commands are at §6.

---

## 1. What was already right

Genuinely clean before this audit started, on all fourteen pages:

| Check | Result |
|---|---|
| One `<h1>` per page | ✅ 14/14 |
| `<link rel="canonical">` | ✅ 14/14, absolute, trailing slash consistent |
| Meta description | ✅ 14/14 present, all distinct |
| Open Graph title/desc/image/url | ✅ 14/14, `og:image` absolute |
| Twitter card | ✅ 14/14 |
| `lang="en"`, `charset`, viewport | ✅ 14/14 |
| JSON-LD parses | ✅ 20 nodes, 0 malformed |
| `Residence` schema | ✅ on 6 project pages (Udaan correctly excluded — commercial) |
| `robots.txt` | ✅ served, sitemap announced absolutely |
| `sitemap-index.xml` | ✅ 14 URLs, production origin, `/thank-you` excluded |
| Sitemap ↔ build parity | ✅ exact — no page missing, no dead URL listed |
| Internal links | ✅ **zero** point at a route that doesn't exist |
| Images with a missing file | ✅ zero |
| Images with no `alt` attribute | ✅ zero |
| Lazy loading below the fold | ✅ e.g. 30/33 on `/gallery`, 24/26 on `/projects/rudra` |

**The three items raised on 13 August were two already-done and one that should
not be done.** The homepage description existed and was 153 characters; the
sitemap existed; and the alt text flagged as "written like literal photo
descriptions" belongs to three **licensed Unsplash stock photographs** — the
other 83 project photos were re-described on 12 August. Making those three read
"Family enjoying their new Nesting Tree apartment" would describe a stranger's
photo as ours. The reasoning is recorded beside the images in `src/data/site.ts`.

---

## 2. What the audit actually found — page weight

This is the real defect, and it is not what any of the checkers flagged.

**Ishaan's page was 35 MB.** Prithvi 23 MB, About 22 MB, Rudra 20 MB. For
comparison, a page that Google considers healthy on mobile is under 2 MB. On a
4G phone in Panvel, 35 MB is roughly a minute of loading before the hero settles
— and Core Web Vitals (LCP in particular) is a live ranking signal, unlike most
of what a free SEO checker measures.

Four causes, all measured:

1. **The homepage hero video was 3840×2160 — 4K — at 7.5 Mbit/s.** It plays
   muted, in a loop, behind three gradient scrims. None of that resolution
   reaches a viewer.
2. **Three hero videos carried stereo audio tracks** (253 kbit/s) on elements
   that are `muted`. Pure waste.
3. **Every floor plan, elevation and render shipped as a 1–3 MB PNG.** They are
   1536×1024 3D renders — a format that PNG stores badly.
4. **The homepage hero had no `poster`.** Its LCP element was the video itself,
   so the hero was flat `bg-ink` until enough of a 9.4 MB file had arrived.

### Fixed — measured before and after

| Page | Before (MB) | After (MB) | Cut |
|---|---|---|---|
| `/gallery/` | 14.0 | 14.0 | 0% |
| `/projects/prithvi/` | 23.3 | 9.5 | 59% |
| `/projects/` | 10.8 | 8.1 | 25% |
| `/projects/shaurya/` | 16.3 | 7.1 | 57% |
| `/` | 15.9 | 6.4 | 60% |
| `/projects/ishaan/` | 35.1 | 5.8 | 83% |
| `/about/` | 21.6 | 5.5 | 74% |
| `/projects/dhruva/` | 11.6 | 4.1 | 64% |
| `/projects/rudra/` | 19.7 | 3.1 | 84% |
| `/projects/shikhar/` | 11.4 | 2.3 | 80% |
| `/contact/` | 1.9 | 1.5 | 24% |
| **Total** | **182.3** | **68.0** | **63%** |

**Deploy size fell from 644 MB to 319 MB** in the same pass.

---

## 3. Everything that changed, and why

### 3.1 Hero videos re-encoded — 87.4 MB → 10.2 MB

Six of the nine were 4–10× heavier than they needed to be. Three others
(`Dhruva_Backdrop`, `Shaurya_Backdrop`, `construction`) were already 720p at
~1.9 Mbit/s and ~2.4 MB — they were left alone, and they are what set the target.

| Video | Before | After |
|---|---|---|
| `homepage_video.mp4` | 9.4 MB (4K) | **1.0 MB** (1080p) |
| `about.mp4` | 20.5 MB | **4.7 MB** |
| `ishaan.mp4` | 24.1 MB | **1.7 MB** |
| `Rudrar_Backdrop.mp4` | 14.4 MB | **1.4 MB** |
| `Shikhar_Backdrop.mp4` | 10.1 MB | **0.8 MB** |
| `prithvi_backdrop.mp4` | 9.0 MB | **1.2 MB** |

H.264 CRF 28, `+faststart` so playback can begin before the file finishes, and
`-an` to strip the audio tracks nobody can hear. The homepage kept 1080p because
it is the most-seen surface; the project heroes went to 720p to match the three
that were already fine. A frame from the re-encoded homepage video was checked
by eye against the original — no visible artefacts.

**The originals are in git.** `git checkout <commit>~1 -- public/images/projects/`
restores every one of them if a single frame looks wrong on a big screen.

### 3.2 Plans, elevations and renders → WebP — 47.3 MB → 10.1 MB

Twenty-three drawing sheets and renders converted at quality 90, typically **87–93%
smaller**. A converted ground-floor plan was opened and read at full size first:
every room label and dimension is still legible.

Two files were converted, measured, and **put back**: `Rudra.jpg` came out 52%
*larger* as WebP and `Ishan-Reduced.jpg` 17% larger — both are already-compressed
JPEGs, where WebP has nothing left to win. That is why this was measured per file
rather than run as a blanket sweep.

All twenty-three are appended to `src/lib/image-redirects.ts`, which does two
jobs: `src/middleware.ts` 301s the old URL forever, and
`scripts/prune-superseded-images.mjs` keeps the superseded originals out of
`dist/client`. That is the same machinery the 80 photographs already use — the
map is now 103 entries.

### 3.3 Homepage hero poster

`public/images/projects/homepage-poster.jpg` — the video's own first frame,
1600px wide, **58 KB**. The hero now paints instantly instead of sitting on
`bg-ink`. The command to regenerate it is in a comment above `heroPoster` in
`src/pages/index.astro`; re-run it if the video is ever replaced, or the poster
will show the wrong scene.

### 3.4 `preload="auto"` → `preload="none"` on all nine heroes

Honest note: with `autoplay` set, a browser will fetch the video anyway, so this
is a small win, not a large one. It stops the explicit instruction to download
aggressively and lets the browser schedule it behind the poster and the text.
**The 87 MB saved in §3.1 is what actually moves this number.**

### 3.5 Titles trimmed to under 60 characters

Four were being cut off mid-word in search results, taking the brand name — and
in Dhruva's case the locality — with them.

| Page | Was | Now |
|---|---|---|
| Dhruva | 81 — "Delivered Corner-Plot Residential & Commercial" | 58 — "Delivered Homes & Shops" |
| Rudra | 72 — "Delivered G+4 Residential & Commercial" | 57 — "Delivered Homes & Shops" |
| Udaan | 65 | 57 |
| Shaurya | 61 | 51 |

"Homes & Shops" is how the project files' own copy describes the mix ("24 homes
and 6 shops"), and both words are what a buyer actually types. Udaan keeps
**"in Approvals"** — that qualifier is a truthfulness commitment, not padding,
and a length trim must not take it.

### 3.6 `/contact` meta description, and its hero alt

162 → 145 characters. The hero alt said "A Nesting Tree residence in Navi Mumbai"
over what is in fact the **Prithvi elevation render**; it now says so. Locality
stays at region level because Prithvi's street address is one of the two the
owner has flagged as wrong.

### 3.7 A nested duplicate of the projects folder, moved out of `public/`

`public/images/projects/`**`projects/`** — a second copy of the projects folder,
nested inside itself. **Untracked in git and referenced by nothing in `src/`**,
but `public/` is copied into the build wholesale, so every build shipped the
whole projects folder twice. That alone is why `dist/client` was 644 MB.

Moved to `_quarantine/` (gitignored) rather than deleted. It is now 326 MB of
real files, and **every one of them is a byte-identical duplicate** — verified
by comparison, not assumed:

```
files in _quarantine:                                271
identical copy exists in public/images/projects:     271
same name but different size:                          0
exists only in _quarantine:                            0
```

**The confusing part, and the reason it looks alarming:** the filenames in
`_quarantine` are the same filenames the site uses — `homepage_video.mp4`,
`about.mp4`, `Dhruva_Backdrop.mp4`. They are not the files being served. The
served ones are one directory up, at `public/images/projects/<name>.mp4`, and
all nine were checked present at the right sizes after the move:

| Referenced URL | Live file |
|---|---|
| `/images/projects/homepage_video.mp4` | 1,040 KB ✅ |
| `/images/projects/about.mp4` | 4,743 KB ✅ |
| `/images/projects/ishaan.mp4` | 1,688 KB ✅ |
| `/images/projects/Rudrar_Backdrop.mp4` | 1,458 KB ✅ |
| `/images/projects/Shikhar_Backdrop.mp4` | 850 KB ✅ |
| `/images/projects/prithvi_backdrop.mp4` | 1,244 KB ✅ |
| `/images/projects/Dhruva_Backdrop.mp4` | 2,480 KB ✅ |
| `/images/projects/Shaurya_Backdrop.mp4` | 2,523 KB ✅ |
| `/images/projects/construction.mp4` | 2,331 KB ✅ |

**`_quarantine/` can be deleted.** It holds nothing that does not already exist,
byte for byte, in `public/images/projects/`. It was kept only so the decision
was yours rather than mine.

---

## 4. Still open — ranked, with who owns each

### 4.1 `/gallery` is 14 MB, and four photographs are why — **needs you**

The gallery did not improve at all, because its weight is four un-optimised
photographs that the image rollout **deliberately parked**:

| File | Size | On |
|---|---|---|
| `Prithvi/DSC_0093.jpeg` | 4.2 MB | `/gallery`, `/projects/prithvi` |
| `Prithvi/DSC_0091.jpeg` | 3.0 MB | `/gallery`, `/projects/prithvi` |
| `Shaurya/IMG20260627134928.jpeg` | 2.8 MB | `/gallery`, `/projects/shaurya` |
| `Ishaan/DSC_0101.jpeg` | 2.7 MB | `/gallery`, `/projects/ishaan` |

These are the four in `IMAGE-ROLLOUT-STATUS.md` §2 — **photographs of buildings
that may not be ours.** They were left out of the pipeline pending your answer,
and I have not touched them for the same reason: compressing a photograph we may
have no right to publish does not make it publishable.

**Answer that question and 12.7 MB resolves either way** — optimised if they
stay, gone if they go. It is the largest single item left.

### 4.2 Images without `width`/`height` — layout shift

12 of 13 images on the homepage and 13 of 14 on `/projects` declare no
dimensions, so the browser cannot reserve space and the page jumps as they
arrive. CLS is a Core Web Vitals metric.

Not a launch blocker and not a small edit — it means adding real pixel
dimensions at every call site. The photograph pipeline already writes them for
gallery entries, so the pattern exists to copy.

### 4.3 No `404.astro`

A bad URL currently gets nginx's default page. Worth having; blocks nothing.

### 4.4 Unreferenced files — ~~130 MB~~ **done, 252 MB deleted**

Closed the same day. `node scripts/asset-inventory.mjs` now classifies every
file under `public/` as **used**, **superseded** or **orphan**, and `--prune`
deletes the orphans. It found 46, totalling **251.9 MB** — thirteen unused
videos (`Prithvi2-scrub.mp4` at 60 MB, `Prithvi2.mp4` at 19 MB and the rest),
the two 40 MB+ `_og` files DEPLOYMENT.md §6 had already flagged, and a set of
placeholder SVGs and superseded JPEG plans.

Every one was confirmed tracked in git before deletion, so the whole thing is
reversible with `git checkout`. A stray `node_modules/` and `.astro/` cache
inside `public/images/projects/rudra/` went with them.

`ASSET-INVENTORY.md` is the standing list. See it for what the three classes
mean and why the 103 **superseded** originals are deliberately kept.

### 4.5 Two things Search Console needs, the day DNS resolves

- Submit `https://nestingtree.in/sitemap-index.xml`.
- Run the **Rich Results Test** on one project page. The `Residence` nodes were
  validated against the schema.org vocabulary locally, but Google's own read
  needs a live URL. Expect one known warning — `provider` on a `Place` — which
  is deliberate and documented in `src/lib/structured-data.ts`. **Do not
  "fix" it.**

---

## 5. The verdict

**Go live.** The site is technically sound: every crawlability fundamental
passes on every page, the structured data is valid, the sitemap and robots.txt
are correct, and the page-weight problem that would actually have cost rankings
is fixed — 63% off, with the worst page down from 35 MB to 5.8 MB.

**What is blocking launch is not code.** `nestingtree.in` is still a parked
domain: it answers with a 114-byte redirect to `/lander` and the parking
provider's own `robots.txt`. Until DNS points at the server there is nothing to
index and nothing to submit.

Order of operations:

1. Point the apex and `www` A records at the server.
2. `git pull && npm ci && npm run build` on the server — **`npm run build`, not
   `astro build`**. The prune step is a `postbuild` hook and `astro build` alone
   skips it, shipping 103 superseded originals.
3. Leave `PUBLIC_SITE_URL` **unset** so the sitemap keeps the production origin.
4. Serve with `deploy/nginx-nestingtree.conf` — **not `nginx-ip-only.conf`**,
   which sets `X-Robots-Tag: noindex, nofollow` and would deindex the entire
   site no matter what `robots.txt` says.
5. Certbot, then confirm `curl https://nestingtree.in/robots.txt` returns our
   four lines and not the parking page's.
6. Then §4.5.

---

## 6. Reproducing this

```bash
npm run build                 # NOT astro build — postbuild prunes 103 originals
node scripts/image-audit.mjs  # image inventory + contact sheets
```

The audit script itself writes nothing to `src/` or `public/`; it reads
`dist/client` and prints JSON. Re-run it after any content change and compare
the weight table in §2 — that is the number worth watching.
