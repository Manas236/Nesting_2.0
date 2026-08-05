# Nesting Tree — deep end-to-end analysis

**Date:** 3 August 2026 · **Branch:** `full-snapshot` · **HEAD:** `3bfad37`
**Scope:** all 10 routes (12 prerendered pages + 2 SSR routes), `src/data/*.ts` as
content, `/api/contact`, `src/lib/db.ts`, `public/`.
**Method:** every finding below was read out of the file and, where it depends on
rendering, confirmed against `dist/` after a real build. Nothing here is inferred from
a comment or a doc.

---

## 0. Build

```
$ npm run build
[@astrojs/node] Enabling sessions with filesystem storage
[types] Generated 44ms
[build] output: "static"   mode: "server"   adapter: @astrojs/node
[vite]  ✓ built in 1.66s / 181ms / 684ms
prerendering static routes — 12 pages, ✓ Completed in 82ms
[build] Server built in 2.76s
[build] Complete!

real  0m9.729s
```

**Zero errors, zero warnings.** Astro 7.0.0, Node 24.17.0. Wall time 9.7 s; Astro's own
work ~2.8 s, the rest is npm start-up and copying `public/`.

| Output | Size |
|---|---|
| `dist/` total | **629 MB** |
| `dist/client/images` | 627 MB |
| `dist/client/_astro` | 180 KB |
| `dist/server` | ~1 MB |

Two things the build output itself reveals:

- **`_astro/` ships the same 81,189-byte stylesheet twice** — `SiteHeader.DELesNe-.css`
  and `thank-you.DELesNe-.css` are byte-identical (same content hash, two entry names).
  That 79 KB file is a render-blocking `<link>` on every page.
- **`dist/client/nesting tree content (1).docx` (18.9 KB)** — a source Word document is
  published at `https://nestingtree.in/nesting%20tree%20content%20(1).docx`.
- The `.astro/`, `node_modules/` and `dist/` folders inside
  `public/images/projects/rudra/` are copied verbatim into the deploy (see H-6).

---

## Blocker

None. The build is clean, the site renders, the form writes to the database, and there
is no security hole that leaks data or allows injection.

---

## High

### H-1 · The in-page section nav is passed by 8 pages and rendered by none

`src/components/SiteHeader.astro:20`

```js
const { sections = [] } = Astro.props;
```

`sections` is destructured and then never referenced anywhere in the template
(lines 48–132). The component's own doc block says otherwise:

`src/components/SiteHeader.astro:7-9`
```
   Page-specific section jump links (Overview / Units / Amenities …) are passed
   in via `sections` and render as a secondary strip *below* the global row,
```

Eight pages pass it: `about.astro:39`, `projects/index.astro:64`, and all six project
pages (`shikhar.astro:79`, `dhruva.astro:70`, `ishaan.astro:81`, `prithvi.astro:81`,
`rudra.astro:73`, `shaurya.astro:68`).

Confirmed in the build — the strip is absent from the DOM entirely:
```
$ grep -c 'subnav-link\|section-nav' dist/client/projects/shikhar/index.html
0
$ grep -c 'subnav-link\|section-nav' dist/client/about/index.html
0
```

`src/styles/global.css:98-134` is 37 lines of dead CSS written for that strip
(`#site-header .subnav-link`, `#section-nav`, hover/current/scrolled states, scrollbar
hiding). `ctaHref` is likewise declared at `SiteHeader.astro:17`, passed by six pages,
and never destructured.

**Impact.** The project pages are 900–1,130 source lines and render as very long
scrolls. Overview / Units / Progress / Amenities / Safety / Gallery are unreachable
except by scrolling. On `/about` the same is true of Story / Founder / Vision / Journey.
The only place those anchors survive is the project-page footer's "This project" column,
at the very bottom of the page.

**Smallest fix.** Render the strip in `SiteHeader.astro` — the CSS it needs already
exists and is already shipped. One block, below the existing `<nav>`, guarded by
`sections.length > 0`.

---

### H-2 · Prithvi's 2BHK card prints two different carpet areas

`src/data/prithvi.ts:258` — rendered by `<AreaStats>` at `prithvi.astro:435`:
```js
{ label: "Carpet area", value: "39.51 sq. m. (425 sq. ft.)" },
```

`src/data/prithvi.ts:264` — rendered as a ticked feature bullet fifteen lines further
down the same card (`prithvi.astro:437-455`):
```js
"Carpet area — 795 sq.ft",
"Super built-up area — 1,380 sq.ft",
```

The file already knows. `src/data/prithvi.ts:283-290`:
```
   CONFLICT TO RESOLVE BEFORE LAUNCH: the 2BHK `features` above carry
   "Carpet area — 795 sq.ft" and "Super built-up area — 1,380 sq.ft"
   … The approved plan puts the largest flat in the building at 39.512
   sq. m. = 425 sq. ft. carpet … so 1,380 sq. ft. cannot belong to one
   of them. The card now states both figures. Decide which is right
   and drop the other.
```

**Impact.** Carpet area is a statutorily defined term under RERA §2(k). One card on a
live page states it as both 425 sq ft and 795 sq ft — an 87% discrepancy. This is the
single highest-liability item in the report.

**Smallest fix.** Delete the four `features` bullets at `prithvi.ts:264-267` that
restate areas. The `stats` block already carries the approved-plan figure and the
`unitTypesNote` cites the drawing.

---

### H-3 · Ishaan states three different carpet areas across one page

| Where | Value | Renders as |
|---|---|---|
| `ishaan.ts:94` | `"17.70 sq.mt (≈ 190 sq.ft) per 1RK"` | Overview key-facts row |
| `ishaan.ts:259` | `"15.22 – 19.08 sq. m. (164 – 205 sq. ft.)"` | Unit card `<AreaStats>` |
| `ishaan.ts:337-338` | `"about 17.70 sq.mt of carpet"` / `"≈ 17.70 sq.mt carpet each"` | "One kind of home" level card |

`src/data/ishaan.ts:266-270` records that 17.70 is wrong and was removed from a fourth
place:

```
      // The old "RERA carpet area — 17.70 sq.mt (≈ 190 sq.ft)" bullet
      // was removed: the approved plan records 15.223, 19.080 and
      // 16.590 — 17.70 matches none of them, and is not their mean
      // (16.964) either.
```

It was removed from `features` and left in `overview.facts` and `levels`.

**Impact.** Same class as H-2, on a pre-launch project. A figure the codebase
documents as unsupported by the approved plan is printed twice on the live page.

**Smallest fix.** Delete `ishaan.ts:94`; change `ishaan.ts:337-338` to the range.

---

### H-4 · Ishaan's floor/unit story contradicts its own flat numbers

`src/data/ishaan.ts:93` (Overview) and `:186` (floor plans) and `:328` (levels):
```js
{ label: "Configuration", value: "12 × 1RK · four homes per typical floor (2nd–4th)" },
```
`src/data/ishaan.ts:254`:
```js
series: "Typical floors · 2nd–4th",
```

But `ishaan.ts:260-262` lists the approved-plan series:
```js
{ label: "Flats 101 / 201 / 301 / 401", value: "15.22 sq. m. (164 sq. ft.)" },
{ label: "Flats 102 / 202 / 302 / 402", value: "19.08 sq. m. (205 sq. ft.)" },
{ label: "Flats 103 / 203 / 303 / 403", value: "16.59 sq. m. (179 sq. ft.)" },
```

Three flats per floor over floors **1–4**. Both arithmetics give twelve, but they cannot
both be on the page. `ishaan.ts:224-230` documents the contradiction and leaves it.

**This resolves LAUNCH-PUNCHLIST item 2 and makes it wrong.** The punch list says
"A G+4 with 12 homes has an unexplained 1st floor … If residential, the homes count
needs rechecking — 4 homes × floors 1–4 is 16, not 12." The 1st floor *is* residential
(flats 101/102/103 appear in the carpet statement), and 3 × 4 = 12 reconciles exactly.
The open question is not the homes count; it is which of "four per floor, 2nd–4th" or
"three per floor, 1st–4th" is printed.

**Smallest fix.** Pick the drawing's version (three per floor, floors 1–4) and change
five strings: `ishaan.ts:93`, `:99`, `:186`, `:254`, `:328`.

---

### H-5 · Shaurya prints a flat-number pairing the file knows is backwards

`src/data/shaurya.ts:120-129`:
```
   SERIES LABELS BELOW ARE THE WRONG WAY ROUND — left as supplied,
   flagged for the owner. … So the 1BHK is flat 102 and the 1RK is flat
   101, not the reverse. `stats` uses the correct pairing; `series`
   still says otherwise until the owner confirms the swap.
```

The wrong pairing is printed in six places, not one:

| Line | Text |
|---|---|
| `shaurya.ts:146` | `series: "Flat 101 · one per floor"` (on the 1BHK) |
| `shaurya.ts:149` | `"…one-bedroom apartments, flat 101 on each floor."` |
| `shaurya.ts:173` | `series: "Flat 102 · one per floor"` (on the 1RK) |
| `shaurya.ts:179` | `"…efficient 1RK layouts, flat 102 on each floor."` |
| `shaurya.ts:238` | `"Flat 101 is the 1BHK and flat 102 the 1RK…"` |
| `shaurya.ts:241-242` | `"Flat 101 — 1BHK with balcony"` / `"Flat 102 — 1RK"` |

Meanwhile `stats` (`:151`, `:181`) uses the *correct* pairing — so the same page tells a
buyer that flat 101 is a 23.85 sq m 1BHK, when by the file's own reasoning flat 101 is
the 19.32 sq m 1RK.

**Impact.** A buyer asking for "flat 301" gets the wrong home. In a sold-out building
this is a correction, not a sale — but it is wrong in public.

**Smallest fix.** Swap the two `series` strings and update the four prose references, or
drop flat numbers from the page until the owner confirms.

---

### H-6 · 250.6 MB of `public/` (40%) is never referenced, and ships anyway

Computed by resolving every `/images/...` string in `src/` against the 193 real files
under `public/` (excluding the detritus folders). One reference is unresolved
(`/images/qr/shikhar.png`) and it appears only in a code comment, so **nothing on the
site 404s**. The problem is the other direction.

**The scroll-scrub videos are all dead.** You asked which videos are scroll-scrubbed:
none. All four `*-scrub.mp4` files are unreferenced, including the largest file in the
repository:

```
  60.51 MB  /images/projects/Prithvi2-scrub.mp4
  10.51 MB  /images/projects/PRITHVI-scrub.mp4
   7.59 MB  /images/projects/Rudra-scrub.mp4
   7.40 MB  /images/projects/Rudra2-scrub.mp4
```

Top of the unreferenced list:

```
  60.51 MB  Prithvi2-scrub.mp4          10.60 MB  prithvi_backdrop_2.mp4
  44.24 MB  Prithvi-Elevation_og.jpg    10.51 MB  PRITHVI-scrub.mp4
  39.48 MB  ShikharElevationFinal_og.jpeg 9.78 MB  Dhruva_Backdrop_2.mp4
  18.78 MB  Prithvi2.mp4                 7.59 MB  Rudra-scrub.mp4
  10.75 MB  Shaurya_Backdrop_2.mp4       7.40 MB  Rudra2-scrub.mp4
```
plus `Rudra.mp4` 2.63, `Rudra2.mp4` 2.54, `homepage_video_1.mp4` 2.45,
`Shikhar_Backdrop_2.mp4` 2.38, `PRITHVI.mp4` 2.37 — **14 of the 22 MP4s are unused,
196 MB of the 241 MB of video.** Then `Prithvi_Ground_Plan.png` 2.55 MB (deliberately
withheld — `prithvi.ts:25-28`), four near-duplicate `(1)` photos, eight placeholder SVGs
from the old pending-plan era, `ShikharElevationFinal_copy.jpeg`, four Dhruva render
work-files, and `nesting tree content (1).docx`.

**Build detritus.** Beyond the `.astro/` and `node_modules/` you already found, there is
also an empty `public/images/projects/rudra/dist/`. Total 31 files / 1.2 MB, including
**14 Vite `.js.map` source maps** for Astro's dev toolbar. All of it is copied to
`dist/client/images/projects/rudra/` (40 files) and served in production.

**Smallest fix.**
```bash
rm -rf "public/images/projects/rudra/.astro" \
       "public/images/projects/rudra/node_modules" \
       "public/images/projects/rudra/dist" \
       "public/nesting tree content (1).docx"
git rm -r --cached ...   # and add public/**/node_modules/ to .gitignore
```
Then delete the 14 unused MP4s and the two `_og` files: **~280 MB, 45% of the deploy,
with zero visual change.** The full list is reproducible from the reference scan.

---

### H-7 · `/gallery` declares a 3.2 MB, 4608×3072 photo as a 1200×630 share card

`src/pages/gallery.astro:26,36`:
```js
const heroImage = "/images/Project_Images/Shaurya/Aerial_View/DSC_0182.jpeg";
...
<BaseLayout title={pageTitle} description={pageDesc} image={heroImage}>
```

`BaseLayout.astro:54-55` hard-codes the dimensions for every page:
```html
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

Built output:
```html
<meta property="og:image" content="https://nestingtree.in/images/Project_Images/Shaurya/Aerial_View/DSC_0182.jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
```
The file is **4608×3072, 3.17 MB**.

This is exactly what `BaseLayout.astro:14-15` warns against:
```
  // Share-card image. Pass one of the purpose-built 1200×630 cards in
  // /images/og/ — NOT a hero render. See the note below.
```

**Impact.** WhatsApp will not fetch a 3.2 MB image; `/gallery` shares with no preview
card. Facebook and LinkedIn will crop against declared dimensions that are false.
`/images/og/default.jpg` (61 KB, correctly 1200×630) already exists and is the default.

**Smallest fix.** Delete `image={heroImage}` from `gallery.astro:36`, or point it at a
purpose-built card. The same image also carries `fetchpriority="high"` at
`gallery.astro:52` — see M-1.

---

### H-8 · Six live project pages show a "Placeholder — artwork pending" panel

All six pages render the QR band with no artwork:
```
src/pages/projects/shikhar.astro:679:  <QrBlock project="Shikhar" />
src/pages/projects/dhruva.astro:750   ishaan.astro:868   prithvi.astro:868
src/pages/projects/rudra.astro:740    shaurya.astro:871
```

`src/components/QrBlock.astro:78` then renders, inside a dashed box:
```html
<span class="block text-stone/35 text-xs mt-2">Placeholder — artwork pending</span>
```
directly under the section's own promise (`QrBlock.astro:23`):
> "Scan the code for the Shikhar brochure, floor plans and a direct line to our sales
> team. No forms, no waiting."

`public/images/qr/` does not exist.

**Impact.** A full-width dark section on every project page, headed "Point your camera
here", containing an empty dashed square labelled as unfinished. It reads as an
unfinished website to every visitor.

**Smallest fix.** Comment out the six `<QrBlock />` calls until artwork exists — one
line per page. (Generating six QR codes pointing at each project URL is the better fix,
but removal is the smaller one.)

---

### H-9 · `/#journey` is a dead anchor in all six project-page footers

`src/pages/projects/shikhar.astro:840` (and `dhruva.astro:911`, `rudra.astro:901`,
`shaurya.astro:1032`, `ishaan.astro:1045`, `prithvi.astro:1045`):
```html
<li><a href="/#journey" class="hover:text-olive-100 transition-colors">Our journey</a></li>
```

The home page has no `id="journey"`:
```
$ grep -o 'id="[a-z-]*"' src/pages/index.astro
id="top"  id="hero-video"  id="miles-track"  id="t-rail"  id="contact"
```
It lives at `src/pages/about.astro:335` — `<section id="journey" …>`.

**Impact.** Six pages × one link that dumps the visitor at the top of the home page
instead of the company timeline.

**Smallest fix.** `/#journey` → `/about#journey` in six files.

This is the *only* broken link on the site. Every other internal href, anchor, `tel:`
and `mailto:` was checked programmatically and resolves. `#contact` correctly rewrites
to `/#contact` off-home via `SiteHeader.astro:36`.

---

### H-10 · The seven pages that collect PII don't link to the privacy policy

| Page | links `/privacy` | links `/terms` |
|---|---|---|
| `/` | ✅ `index.astro:726` | ✅ `:727` |
| `/about` | ✅ | ✅ |
| `/projects` | ✅ | ✅ |
| `/gallery` | ❌ | ❌ |
| `/projects/{6 pages}` | ❌ | ❌ |
| `/thank-you` | ❌ (no footer) | ❌ |

The six project pages are the ones carrying `<form action="/api/contact" method="POST">`
(`shikhar.astro:700` +5). Their footer bottom bar has only:

`src/pages/projects/shikhar.astro:886-888`
```html
<div class="flex items-center gap-5">
  <a href="/" class="hover:text-stone/70 transition-colors">Back to home</a>
</div>
```

The form's own consent line (`shikhar.astro:778-780`) is a bare sentence with no link:
```html
<p class="text-mutedlight text-xs leading-relaxed mt-4 text-center">
  By submitting, you agree to be contacted about Shikhar by Nesting Tree.
</p>
```

**Impact.** Under the DPDP Act 2023 the notice has to be available at the point of
collection. It isn't. `/privacy` itself is well drafted and accurate — §2 lists exactly
the six fields `contact.ts:20-31` writes, and even discloses the Google Fonts IP leak
(`privacy.astro:77-82`). It's just not reachable from where it matters.

**Smallest fix.** Add `<a href="/privacy">Privacy Policy</a>` and `/terms` to the six
project footers and the gallery footer, and link "Privacy Policy" inside the consent
sentence.

---

### H-11 · Per-page first-paint cost is 9–24 MB on six of ten pages

Every hero video is `autoplay muted loop playsinline preload="auto"` with no `<source>`
fallback and no byte budget. Measured from disk:

| Page | HTML | CSS | Video (autoplay, preload=auto) | Poster | **Total** | 4G | 3G |
|---|---:|---:|---:|---:|---:|---:|---:|
| `/projects/ishaan` | 80 KB | 79 KB | **23.49 MB** `ishaan.mp4` | 0.57 | **24.21 MB** | 15.1 s | 60.5 s |
| `/about` | 32 KB | 79 KB | **19.97 MB** `about.mp4` | 1.23 | **21.31 MB** | 13.3 s | 53.3 s |
| `/projects/rudra` | 102 KB | 79 KB | 14.05 MB | 1.23 | **15.45 MB** | 9.7 s | 38.6 s |
| `/projects/shikhar` | 99 KB | 79 KB | 9.89 MB | 1.59 | **11.66 MB** | 7.3 s | 29.2 s |
| `/projects/prithvi` | 88 KB | 79 KB | 8.80 MB | 1.76 | **10.72 MB** | 6.7 s | 26.8 s |
| `/` | 62 KB | 79 KB | 9.15 MB (**no poster**) | — | **9.29 MB** | 5.8 s | 23.2 s |
| `/projects/shaurya` | 88 KB | 79 KB | 2.46 MB | 2.11 | 4.74 MB | 3.0 s | 11.8 s |
| `/gallery` | 72 KB | 79 KB | — | **3.17** | 3.32 MB | 2.1 s | 8.3 s |
| `/projects/dhruva` | 105 KB | 79 KB | 2.42 MB | 0.15 | 2.75 MB | 1.7 s | 6.9 s |
| `/projects` | 36 KB | 79 KB | 2.28 MB | 0.15 | 2.54 MB | 1.6 s | 6.3 s |
| `/thank-you` | — | 79 KB | — | 2.31 | 2.39 MB | 1.5 s | 6.0 s |
| `/privacy`, `/terms` | 13 KB | 79 KB | — | — | 0.09 MB | 0.1 s | 0.2 s |

4G assumes 1.6 MB/s effective throughput; 3G 0.4 MB/s. Both figures are the *download*
alone — no TTFB, no font round-trip, no decode.

Posters are full-resolution portrait renders: `Rudra.jpg` **3072×4096** (1.23 MB) is the
poster on both `/about` and `/projects/rudra`; `Ishan-Reduced.jpg` is 2730×4096;
`Prithvi-Elevation.jpg` 2730×3619 at 1.76 MB. None is sized for a hero slot.

**Then the galleries.** Every gallery thumbnail is the full-resolution original with no
`srcset` and no intrinsic dimensions:

| Page | Photos | Lazy payload on scroll |
|---|---:|---:|
| `/projects/dhruva` | 20 | 53.0 MB |
| `/projects/rudra` | 17 | 46.5 MB |
| `/projects/shaurya` | 15 | 39.1 MB |
| `/projects/shikhar` | 13 | 37.3 MB |
| `/projects/prithvi` | 8 | 28.0 MB |
| `/projects/ishaan` | 10 | 25.8 MB |
| **`/gallery`** | 30 visible (5 × 6) | **87.2 MB** + 3.2 MB hero |

So scrolling `/projects/dhruva` to the bottom pulls ~56 MB; `/gallery` ~90 MB. The
lightbox then re-requests the same 2–4 MB original at full size
(`ProjectGallery.astro:58` `href={it.src}` → `imgEl.setAttribute("src", s.src)` at `:354`).

**Impact.** A visitor who lands on `/`, opens `/projects/ishaan` and scrolls its gallery
downloads ~60 MB. DEPLOYMENT.md §6's "30–60 MB per visitor" estimate is, if anything,
conservative once galleries are counted.

**Remediation, with expected savings**

1. **Re-encode the 8 live videos** to H.264 High, CRF 26, 1280×720, ~1.2 Mbps, capped at
   12 s and stripped of audio. `ffmpeg-static` is already a devDependency.
   `ishaan.mp4` 23.5 MB → ~1.8 MB, `about.mp4` 20.0 → ~1.5, `Rudrar_Backdrop` 14.1 → ~1.1,
   `Shikhar_Backdrop` 9.9 → ~0.8, `homepage_video` 9.2 → ~0.7, `prithvi_backdrop` 8.8 → ~0.7.
   **~78 MB → ~9 MB across the eight pages.**
2. **`preload="auto"` → `preload="none"` plus a real poster**, and start playback from
   an IntersectionObserver. First paint becomes the poster only; the video costs nothing
   until it is on screen. Saves the entire video byte on `/privacy`-style bounces.
3. **Give `/` a poster.** `index.astro:21-25` removes it deliberately to avoid a flash,
   but the cost is a black hero for every reduced-motion and slow-connection visitor.
   A 40 KB dark first-frame JPEG solves both.
4. **Resize the posters** to 1600 px on the long edge, ~120 KB each. 1.2–2.1 MB → ~0.12 MB.
5. **Generate 640/1280 px WebP derivatives for gallery thumbnails**, keep the original
   for the lightbox only. `/gallery` 90 MB → ~6 MB; `/projects/dhruva` 53 MB → ~4 MB.
6. Add `width`/`height` to gallery `<img>` tags — the CSS-columns masonry
   (`ProjectGallery.astro:110-125`) reflows on every image load today.

Items 1–4 alone take the worst page from 24 MB to under 2 MB.

---

## Medium

### M-1 · `/gallery` marks a 3.2 MB image as the highest-priority resource

`src/pages/gallery.astro:48-53`
```html
<img
  src={heroImage}
  alt="Aerial view from a Nesting Tree rooftop — a passenger plane on approach…"
  class="absolute inset-0 w-full h-full object-cover object-[68%_32%]"
  fetchpriority="high"
/>
```
4608×3072, 3.17 MB, rendered into a `clamp(460px,64vh,660px)` band. `fetchpriority="high"`
tells the browser to fetch it ahead of the stylesheet and fonts.

**Fix.** Resize to ~1920×1280 (~180 KB) and keep `fetchpriority="high"`.

---

### M-2 · No length validation anywhere, and the DB will reject the overflow

`src/pages/api/contact.ts:20-31`
```js
const name = String(form.get("name") ?? "").trim();
const phone = String(form.get("phone") ?? "").trim();
...
const sourcePage =
  String(form.get("source_page") ?? "").trim() ||
  request.headers.get("referer") ||
  null;
```
The only check is `if (!name || !phone)` at `:34`. No `maxlength` on any input either
(`shikhar.astro:706-770` and the five siblings).

`db/schema.sql:20-27` caps them:
```sql
  name        VARCHAR(120)  NOT NULL,
  phone       VARCHAR(40)   NOT NULL,
  email       VARCHAR(160),
  project     VARCHAR(60),
  source_page VARCHAR(255),
```

In MySQL 8's default strict mode any overflow raises `ER_DATA_TOO_LONG`, the `catch` at
`:44` fires, and the visitor is redirected to `/thank-you?status=error` — **losing
everything they typed**, with no indication which field was the problem. `source_page`
is fed an unbounded `Referer` header, so a long URL from an ad campaign can trip this
without the visitor typing anything unusual.

Also: no `name="source_page"` hidden field exists on any of the six forms, so the column
depends entirely on the browser sending `Referer`.

**Fix.** Add `.slice(0, N)` per field in `contact.ts` matching the column widths, and
`maxlength` on the inputs. Two lines and six attributes.

**Positive findings for this section, stated plainly:** there is **no SQL injection
surface** — `pool.execute` with six placeholders (`contact.ts:39-43`). Error messages
leak nothing: `console.error` server-side, generic redirect to the client
(`:45-46`). No secret is reachable from a client bundle — `db.ts` is imported only by
the SSR route. `.env` is git-ignored (`.gitignore:17`) and its keys match
`.env.example` exactly; the only drift is that `.env.example` omits `HOST`/`PORT`, which
DEPLOYMENT.md §3 lists as required.

---

### M-3 · DEPLOYMENT.md's schema and the repo's schema disagree, and the doc denies the file exists

`DEPLOYMENT.md:66`
> There is **no migration file in this repo** — the `leads` table has to be created by hand.

`db/schema.sql` exists and is exactly that migration. The two DDLs also differ:

| Column | `db/schema.sql` | `DEPLOYMENT.md:76-88` |
|---|---|---|
| `id` | `INT AUTO_INCREMENT` | `BIGINT UNSIGNED` |
| `phone` | `VARCHAR(40)` | `VARCHAR(30)` |
| `email` | `VARCHAR(160)` | `VARCHAR(190)` |
| `source_page` | `VARCHAR(255)` | `VARCHAR(500)` |
| indexes | none | `idx_created_at`, `idx_project` |

Whoever follows the doc gets a different table from whoever runs the file. The doc's
version is the better one (500-char `source_page` materially reduces M-2).

**Fix.** Update `db/schema.sql` to the DEPLOYMENT.md DDL and change §4 to say
`mysql -u root -p < db/schema.sql`.

---

### M-4 · `og:image:secure_url` becomes an `http://` URL when built for an IP

You asked what happens with an IP. I built it:

```
$ PUBLIC_SITE_URL=http://13.234.56.78 npx astro build
```
```html
<link rel="canonical" href="http://13.234.56.78/projects/shikhar/">
<meta property="og:url" content="http://13.234.56.78/projects/shikhar/">
<meta property="og:image" content="http://13.234.56.78/images/og/shikhar.jpg">
<meta property="og:image:secure_url" content="http://13.234.56.78/images/og/shikhar.jpg">
```

Everything resolves absolutely and correctly — `BaseLayout.astro:28-29` does its job.
But `og:image:secure_url` is defined by the Open Graph protocol as *"an alternate url to
use if the webpage requires HTTPS"*. An `http://` value there is invalid, and Facebook's
scraper prefers `secure_url` over `og:image`, so a share from the IP preview can fail
even though `og:image` itself is fine.

Canonicals also point at the IP, which would let Google index it — mitigated because
`deploy/nginx-ip-only.conf:38` sets `X-Robots-Tag: noindex, nofollow` at server level and
`location /` (which serves all HTML) declares no `add_header` of its own, so it inherits.

**Fix.** In `BaseLayout.astro:52`, emit `og:image:secure_url` only when
`Astro.site.protocol === "https:"`. One conditional.

---

### M-5 · `nginx-ip-only.conf` drops its security headers on every static asset

`deploy/nginx-ip-only.conf:37-39` sets `X-Robots-Tag`, `X-Content-Type-Options` and
`Referrer-Policy` at server level. But nginx's `add_header` is *replaced*, not inherited,
by any child block that declares its own. `location /_astro/` (`:63`, with
`add_header Cache-Control` at `:65`) and `location /images/` (`:70`, with `add_header` at
`:72-73`) both declare their own, so all three security headers vanish for every image,
video and stylesheet.

HTML is unaffected — `location /` (`:81`) and `location = /api/contact` (`:49`) declare no
`add_header` and inherit correctly — so the noindex intent holds for pages. Images can
still be indexed by Google Images.

**Fix.** Repeat the three `add_header` lines inside those two blocks, or use
`add_header … always` at server level with nginx ≥ 1.7.5 plus explicit repetition.

---

### M-6 · Two palette colours fail WCAG AA, one of them on the RERA figures

`src/styles/global.css:14-15`
```css
  --color-muted: #706c60;
  --color-mutedlight: #9c968a;
```

| Token | On stone `#f4f2ec` | On white `#ffffff` | AA (4.5:1) |
|---|---:|---:|---|
| `--color-muted` | 4.69:1 | 5.25:1 | pass |
| `--color-mutedlight` | **2.63:1** | **2.94:1** | **fail** |
| `text-stone/40` on ink | **3.54:1** | — | **fail** |

`--color-mutedlight` is used for:
- `src/components/AreaStats.astro:104` — the **square-metre figure from the approved
  plan**, i.e. the legally authoritative number, rendered in the least readable colour
  on the page;
- `AreaStats.astro:101` — "None recorded" / "None — open balcony only";
- every form placeholder (`shikhar.astro:712` `placeholder:text-mutedlight`);
- the consent line under the submit button (`shikhar.astro:778`).

`text-stone/40` at `index.astro:721` is the footer bar carrying the copyright and the
MahaRERA line, at 12 px.

**Fix.** `--color-mutedlight` → `#726e65` (4.54:1 on stone, 5.08:1 on white) — same warm
grey, darkened until it passes. Footer bar `text-stone/40` → `text-stone/55` (5.66:1).

---

### M-7 · The focus ring on every form field is invisible

`src/pages/projects/shikhar.astro:712` (and 5 siblings, every input/select/textarea):
```
focus:outline-none focus:border-olive focus:ring-2 focus:ring-olive/20
```

`focus:outline-none` removes the browser default; the replacement is olive at **20%
opacity** — `#dbded9` on white, **1.28:1**. WCAG 2.2 SC 1.4.11 requires 3:1 for
a focus indicator. The `focus:border-olive` change is the only real signal, and it is a
1 px border. There is no global `:focus-visible` rule in `global.css` to fall back on.

**Fix.** `focus:ring-olive/20` → `focus:ring-olive/60` everywhere, plus a global
`:focus-visible { outline: 2px solid var(--color-olive); outline-offset: 2px }`.

---

### M-8 · Carousel controls are `aria-hidden` but keyboard-focusable, and 8 px across

`src/pages/index.astro:470` wraps the prev/next buttons:
```html
<div class="reveal flex items-center gap-2.5 shrink-0" style="--reveal-d:0.24s" aria-hidden="true">
```
`index.astro:535` does the same for the dots. The `<button>` elements inside stay in the
tab order. A keyboard user tabs onto a control that no screen reader can announce —
WCAG 4.1.2 (Name, Role, Value).

The dots are also `class="t-dot h-2 …"` (`index.astro:541`) with
`.t-dot { width: 0.5rem }` (`index.astro:978-980`) — **8 × 8 px**, against WCAG 2.2 SC
2.5.8's 24 × 24 px minimum.

**Fix.** Add `tabindex="-1"` to the six buttons (they are pure pointer affordances by
design — the comment at `:468-469` says so), and give `.t-dot` a transparent
`padding: 8px` so the hit area reaches 24 px without changing the visual.

---

### M-9 · Reduced-motion is handled for animations but not for video or scrolling

Three separate gaps:

1. **`src/styles/global.css:32-34`**
   ```css
   html { scroll-behavior: smooth; }
   ```
   The `@media (prefers-reduced-motion: reduce)` block at `:293-300` covers the four hero
   keyframes and nothing else. Every anchor jump still animates.

2. **`src/pages/index.astro:736-742`** pauses the hero for reduced-motion visitors:
   ```js
   heroVideo.removeAttribute("autoplay");
   heroVideo.pause();
   ```
   This runs after the parser has already seen `preload="auto"`, so the full 9.15 MB is
   still fetched. And since `/` has no poster by design, the reduced-motion visitor gets
   a **black hero** — the comment at `:735` says "Hero film holds on its poster frame",
   which is true on the six project pages and false here.

3. Neither lightbox traps focus. `ProjectGallery.astro:371` and `gallery.astro:633` move
   focus to the close button, but Tab then walks straight out of the `aria-modal="true"`
   dialog into the page behind it. Escape and arrow keys work correctly (`:406-411`).

**Fix.** Wrap `scroll-behavior` in the reduced-motion query; give `/` a poster and set
`preload="none"` when reduced motion is set; add a `keydown` Tab handler to both
lightboxes.

---

### M-10 · Project cards hide their description on every touch device

`src/pages/index.astro:321` and `src/pages/projects/index.astro:197`:
```html
<p class="text-white/70 text-sm leading-relaxed mt-3 max-w-sm max-h-0 opacity-0
   overflow-hidden transition-all duration-500 ease-out
   group-hover:max-h-40 group-hover:opacity-100">
  {p.blurb}
</p>
```

`group-hover:` never fires on touch. The blurb — the only differentiating copy on the
card — is permanently invisible on phones, while still occupying the accessibility tree.
On a project catalogue where mobile is the majority of traffic, that's the value
proposition hidden by default.

**Fix.** Show it unconditionally below `md`, keep the reveal above it.

---

## Low

### L-1 · Punch-list re-verification (28 Jul 2026 → today)

| # | Item | Status |
|---|---|---|
| 1 | Social links `href: "#"` | **Open.** `site.ts:59-63`, renders in 10 footers |
| 2 | Ishaan's 1st floor | **Resolved but wrong.** See H-4 — the drawing answers it; the punch list's "16 not 12" arithmetic is incorrect |
| 3 | Legal review; Grievance Officer name | **Open.** But note there is no placeholder token in `privacy.astro:126-132` — the officer's name is simply absent, so nothing looks unfinished. DPDP §13(3) wants the name |
| 4 | Ishaan/Shaurya lack an Interiors group | **Open**, and the spread has widened: Dhruva/Rudra/Shikhar 3 groups, **Prithvi 4**, Ishaan/Shaurya 2 |
| 5 | `sales` copy-pasted ×6; `office` on 3 of 6 | **Open.** `office` present in `dhruva.ts:33`, `rudra.ts:32`, `shaurya.ts:67`; absent in `shikhar.ts:23-27`, `prithvi.ts:61-65`, `ishaan.ts:68-72` |
| 6 | Phone stored two ways | **Open.** `site.ts:51` `"+91 95940 79317"` vs bare `"95940 79317"` ×6 |
| 7 | Stale comments | **Open, and the list is incomplete.** All four Ishaan items survive at new line numbers: `ishaan.ts:343` "EMPTY BY DESIGN" (the array is full), `:36` "ready to hang once there is an amenity schedule", `:205` "Ishaan is now booking" (status is Pre-launch), `:412` dead `amenitiesNeeded`. **The punch list misses that `prithvi.ts:344-350` carries the identical "EMPTY BY DESIGN" lie above a four-group array, `prithvi.ts:182` says "Prithvi is now booking", `prithvi.ts:136-139` says "No drawings supplied… `planPending` flags them" above two real PNGs with no flag, and `prithvi.ts:473` / `shaurya.ts:406` are the same dead export.** Shaurya's are also live: `shaurya.ts:25` lists the pincode as outstanding (`:50` has 410206) and `:48-49` says "sector not supplied… omitted rather than guessed" while `:50` prints "Sector R2" |
| 8 | Shaurya duplicates its address | **Open.** `shaurya.ts:93` `{ label: "Address", value: shaurya.address }` |
| 9 | Apostrophes | **Open.** 133 straight vs 6 curly. Same five sites, renumbered: `shikhar.ts:34`, `site.ts:249/267/289`, `projects/index.astro:316` |
| 10 | Curly double quotes | **Open.** `about.ts:84` `“Housing for All,”` |
| 11 | Six unit notations | **Open.** `shikhar` `sq. m.`/`sq. ft.` only; `rudra`/`dhruva` same; `prithvi` adds `sq.ft` ×6 and `sq.ft.` ×1; `ishaan` adds `sq.mt` ×5 and `sq.ft` ×2; `shaurya` adds `sq.m` ×2 and `sq.ft` ×1 |
| 12 | Footer en dash | **Open.** `site.ts:53` `"Navi Mumbai, Maharashtra – 410206"` |
| — | "Already done" section | **All verified true.** Ishaan's address, the `on+91` spacing fix (`thank-you.astro:83,113` both use `{" "}`), Vipin as sole contact, K.D. Construction unified, the softened MahaRERA claim, and `/privacy` + `/terms` existing — though see H-10 on where they're linked |

### L-2 · Dhruva's delivery year contradicts the company timeline

`src/data/dhruva.ts:41` — hero stats band on `/projects/dhruva`:
```js
{ figure: "2023", label: "Delivered" },
```
`src/data/site.ts:319-325` — journey timeline on `/about#journey`:
```js
  { year: "2021", title: "Dhruva delivered", place: "Navi Mumbai", … }
```

Dhruva is the only project carrying a year in `heroStats` (Rudra and Shaurya don't), and
it's the one that disagrees. **Fix:** decide which is right; change one line.

### L-3 · No JSON-LD, no `robots.txt`, no sitemap

```
$ grep -rl 'application/ld+json' dist/client/ | wc -l
0
$ ls public/robots.txt public/sitemap*.xml
ls: cannot access …: No such file or directory
```

For a developer with six named projects, addresses, RERA numbers and possession dates,
`Organization` + `LocalBusiness` + one `Residence`/`Product` per project is table stakes
for rich results. DEPLOYMENT.md §7 flags the sitemap gap and it is still open;
`@astrojs/sitemap` works out of the box now that `site` is set.

Titles and descriptions are otherwise good — all 12 pages have unique, hand-written,
non-templated ones (`shikhar.astro:72-74` etc.), each h1 is unique and singular, and
canonical/og/twitter tags are complete and absolute. `/thank-you` inherits the site-wide
description (`thank-you.astro:37` passes only `title`) and carries no `noindex`, which a
conversion page normally would.

### L-4 · Home-page "6 amenities" tile doesn't match the six amenities

`src/data/site.ts:460`
```js
{ value: "6", label: "Amenities as standard", sub: "Rooftop · Gym · Lift · CCTV · Security · Parking" },
```
The `amenities` array at `site.ts:233-294` is: Rooftop Access, Aerial View, Safety &
Access, Dedicated Parking, Lift Access, Spacious Corridors. No gym; "Aerial View" and
"Spacious Corridors" aren't in the sub-label. The `6` is also hard-coded rather than
`amenities.length`, in a band whose stated policy (`site.ts:519-521`) is "Only real,
confirmed figures live here". Cosmetic, but it's the one tile in that band not derived
from data.

### L-5 · Unsupported claims in About copy

- `about.ts:24` — "one of the most trusted residential developers in Navi Mumbai".
  Unverifiable superlative; ASCI-sensitive for real estate.
- `about.ts:54` — "earning the trust of hundreds of homebuyers". The site's own figures
  are 52 delivered homes (Rudra 20 + Dhruva 24 + Shaurya 8). Defensible only if Gopala
  and Lush Meadows are counted, which are K.D. Construction, not Nesting Tree.
- `shikhar.ts:467-468` — "Before-time completion / All 3 previous projects delivered
  ahead of deadline" against `site.ts:349-350` and `home.difference` "Possession on time".
  Two different promises for the same track record.

### L-6 · The enquiry form offers three sold-out projects

`shikhar.astro:749-755` populates the `<select>` from `projects`, all six. Rudra, Dhruva
and Shaurya are `statusLabel: "Delivered & Handed Over"` with `pills: ["All flats sold"]`.
A visitor can submit an enquiry for a building with nothing to sell. **Fix:** filter to
`status === "Ongoing"`, or group them under a disabled optgroup.

### L-7 · Gallery comments claim `(1)` duplicates are excluded; three are included

All six data files carry the same header (`dhruva.ts:485-486`):
> Complete set of documentary photos for this project (renders and near-duplicate "(1)"
> variants excluded).

But `ishaan.ts:477` includes `IMG20260627122601%20(1).jpeg`, `shaurya.ts:464` includes
`DSC_0118%20(1).jpeg`, and `shaurya.ts:472` includes `DSC_0183(1).jpeg`. All three files
exist and render — this is a comment accuracy issue, not a broken link. Meanwhile four
genuine `(1)` duplicates sit unreferenced in `public/` (H-6).

### L-8 · Duplication that has already cost you something

Only reporting duplication that produced a defect found above, as asked:

- **Six near-identical project pages, 922–1,128 lines each.** The `/#journey` bug (H-9)
  exists six times because the footer was copy-pasted six times. So does the missing
  privacy link (H-10) and the invisible focus ring (M-7). A shared `ProjectFooter.astro`
  would have made each a one-line fix.
- **The `sales` block copy-pasted into six data files** produced the `office`-on-three-of-six
  split (L-1 #5) — the punch list's diagnosis is correct and still open.
- **`shikhar.astro:131`** hard-codes the tagline string instead of reading
  `shikhar.tagline` (`shikhar.ts:14`) — the only project page that does. Two sources of
  truth for one sentence.
- **`shikhar.ts` has no `Possession` or `Construction stage` row** in `overview.facts`
  (`:41-46`) though it's the flagship and actively booking; Prithvi (`:80-81`) and Ishaan
  (`:91-92`) both do. Fields present on some projects, missing on others.

### L-9 · `src/scripts/waypoints.ts` is dead code

```
$ grep -rn "waypoints" src/ | grep -v "^src/scripts"
src/data/dhruva.ts:340:   /* Star-trail waypoints … */
src/pages/projects/dhruva.astro:563:  {/* ===== The six waypoints … ===== */}
```
Nothing imports `initWaypoints`. The 97-line module — written per its own header as the
shared skeleton for Shikhar's climb and Dhruva's star-trail — is unreferenced; both pages
implement their own observers inline.

On the behaviour you asked about, for whenever it *is* wired up: `setActive(0)` at
`waypoints.ts:90` runs synchronously before the first IntersectionObserver callback, so a
deep-link or bfcache restore into the middle of the section flashes panel 1 for one frame
before correcting — cosmetic. It has **no resize handling**, which is fine because
`rootMargin: "-50% 0px -50% 0px"` (`:51`) is percentage-based and recomputed by the
observer. The real latent bug is `:79` — `for (const e of entries) if (e.isIntersecting)
target = e.target;` takes the *last* intersecting entry rather than the closest to
centre; with a thin centre band only one panel intersects at a time, so it's correct
today but breaks if the rootMargin is ever widened.

### L-10 · Dead CSS beyond the section-nav block

Confirmed zero usages across `src/pages`, `src/components`, `src/layouts`:
`.btn`, `.btn-primary-dark`, `.btn-ghost-dark`, `.btn-primary-light`, `.btn-ghost-light`
(`global.css:347-395`), `.chip`, `.chip-dark`, `.chip-light` (`:397-417`),
`--color-brick`, `--color-brick-dark` (`:24-25`), plus the `.subnav-link` / `#section-nav`
block from H-1 (`:98-134`). That is ~90 of 418 lines of `global.css`, inside a
render-blocking 79 KB stylesheet. `.blueprint-*`, `.tick`, `.text-hollow`,
`.reveal-left/right`, `--color-sand` and `--color-concrete` **are** used.

---

## The 5 things worth doing first

1. **Fix the three carpet-area contradictions** — H-2 (Prithvi 425 vs 795), H-3 (Ishaan
   17.70 vs 15.22–19.08), H-5 (Shaurya's swapped flat numbers). These are the only
   findings with legal exposure; all three are flagged as wrong in the codebase's own
   comments and are five-minute edits. Do these before anything cosmetic.

2. **Delete 280 MB from `public/`** — H-6. The four `*-scrub.mp4` (86 MB) are for a
   feature that doesn't exist, ten more MP4s are unreferenced, and the two `_og` files
   are already documented as dead. Plus the `node_modules`/`.astro`/`dist` folders and
   the `.docx` currently published at your domain. Pure deletion, zero visual change,
   45% off the deploy.

3. **Re-encode the eight live videos and add `preload="none"`** — H-11 items 1–2.
   `/projects/ishaan` goes from 24 MB to under 2 MB; `/about` from 21 MB to under 2 MB.
   `ffmpeg-static` is already installed. This is the difference between a 15-second and a
   1-second first paint on 4G, on the pages your buyers actually land on.

4. **Render the section nav** — H-1. The prop, the eight call sites and the CSS all
   exist; only the markup is missing. It is the largest usability gap on the site and
   the smallest fix in this list.

5. **Link `/privacy` from the six project pages and fix `/#journey`** — H-10 and H-9.
   Together: seven files, about ten lines, and it closes both the only broken link on the
   site and the DPDP notice-at-collection gap.

---

## What I could not verify

- **Runtime behaviour of `/api/contact` end to end.** No MySQL instance was available and
  I did not start one. The SQL, the parameter binding and the redirect logic were read
  and are correct; the M-2 overflow prediction is based on MySQL 8's default
  `sql_mode=STRICT_TRANS_TABLES` and was not reproduced against a live server.
- **Whether the `leads` table on the production box matches `db/schema.sql` or
  DEPLOYMENT.md's DDL** (M-3). Only the checked-in files were inspected.
- **Real-world 4G timings.** The H-11 table is transfer size ÷ assumed throughput.
  No Lighthouse run, no throttled browser session, no LCP/CLS/INP measurement — I did not
  start a server or drive a browser. Byte counts are exact; seconds are arithmetic.
- **Video dimensions, bitrates and durations.** MP4 atoms were not parsed, so the
  re-encode savings in H-11 are estimates from typical H.264 ratios at the stated targets,
  not measured. File sizes are exact.
- **Whether the MahaRERA numbers are real or currently valid.** `P52000033930` (Dhruva),
  `P52000026245` (Rudra) and `PM1270002502760` (Shikhar) were not checked against the
  MahaRERA portal. Worth noting Shikhar's is a different format and length from the other
  two — that may be the newer numbering scheme rather than an error, but it should be
  eyeballed against the certificate.
- **Whether the facts themselves are true** — floor counts, possession dates, plot
  numbers, the CIDCO approval references. I audited the six data files against *each
  other* and against the approved-plan figures already transcribed in their comments. I
  have no access to the drawings, so where a file and its own comment agree, I treated it
  as consistent, not as verified.
- **Colour contrast over video and photographs.** The M-6 ratios are computed against the
  flat palette tokens. Hero copy such as `about.astro:79` (`text-white/45`) sits on a
  gradient over a moving video; its real-world contrast varies frame to frame and cannot
  be computed statically.
- **Screen-reader behaviour.** The a11y findings come from reading markup against WCAG
  criteria. No NVDA/VoiceOver pass was run.
- **The `previews/thank-you` and `design/*.html` directories**, which are outside the
  audited scope and not part of the build.
