# Nesting Tree — post-launch punch list

Everything deferred from the pre-launch pass on **28 July 2026**. Nothing here
blocks the site going live; all of it is worth clearing afterwards.

Items are grouped by whether they need a decision from you or can just be done.

---

## Needs a decision / data from you

### 1. Legal pages need a lawyer's eyes
`/privacy` and `/terms` were drafted to be accurate to what the site actually
does, but they are **not legal advice and have not been reviewed**. Two
placeholders to fill:
- the Grievance Officer's name (privacy, §8)
- the registered office address / CIN, if you want them shown

The clause that matters most commercially is **Terms §3** — renders and plans
are indicative, nothing on the site is an offer, the Agreement for Sale
prevails. Don't let anyone soften that.

### 2. Missing content
- **Ishaan and Shaurya have no interior finishes spec.** Shikhar and Rudra both
  have an "Interiors" amenity group (tiles, fittings, windows); these two have
  none, so they show 2 groups where peers show 3.
- **Ishaan's gallery is the thinnest on the site** — 10 photos in 2 categories
  (Exterior, Interior) vs Rudra's 17 across 7. No aerial, entrance, lift,
  parking or rooftop shots.

---

## Can just be done — no input needed

**Items 3, 4 and 5 were cleared on 11 Aug 2026** — see *Cleared since launch*
at the foot of this file. Item 6 is the only one of this group still open, and
it is here rather than above because it needs a house rule, not information.

### 6. Shaurya duplicates its address
It's the only project with an **Address** row inside `overview.facts`
(`src/data/shaurya.ts`), repeating what the hero already shows. Either every
page does this or none.

---

## Typography — needs one style decision, then a sweep

### 7. Apostrophes
**Re-counted 11 Aug 2026 — down to two outliers, not five.** The `can’t` /
`that’s` / `you’re` in `site.ts` and the `aren’t` / `They’re` in
`projects/index.astro` are all gone, presumably rewritten in the live editor;
only these survive:

- [`src/data/shikhar.ts:32`](src/data/shikhar.ts#L32) — `Years’ experience`
- [`src/data/site.ts:363`](src/data/site.ts#L363) — `that’s` (amenity 04)

They render as visibly different glyphs from the straight ones beside them.
Straight-everywhere is now **2 edits**; curly-everywhere is ~240 apostrophes
across `src/` but is typographically correct for a site this polished. The
cheap option got a lot cheaper, which is worth knowing before you choose.

### 8. Curly double quotes in exactly one place — ~~open~~ **moot**
`src/data/about.ts:84` — `“Housing for All,”`. Checked on 11 Aug 2026 and the
string is **gone from the source entirely**; it survives only in this file and
in `DEEP-ANALYSIS.md`. It went with one of the commitments deleted in the live
editor on 6 Aug 2026 (`content_edits` 91–93 / 96–98, noted in `about.ts`).
There is no curly double quote left anywhere in `src/`, so there was nothing to
edit. Nothing to do — kept here only so the next reader doesn't go hunting.

### 9. Six notations for the same units — **closed by consequence, 12 Aug 2026**
Nothing was swept. His #13 took the area grid off every page (see that item),
and with it went every one of the notations below except two. Counted in the
built HTML, the whole site now prints exactly **`sq. ft.` on `/projects/rudra`
and `sq. m.` on `/projects/dhruva`** — 23 figures between them, in one house
style, dotted and spaced the same way. There is no inconsistency left to fix.

Both survivors are outside the grid: Rudra's saleable-area badges
(`340–560 sq. ft.`, and `560 sq. ft.` on each layout) and Dhruva's `500 sq. m.`
plot size. **Neither is a carpet area** — `rudra.ts` says so in its own comment,
the plan tops out at 226 sq. ft. of carpet — so neither was in #13's scope.
If the grid is ever switched back on, the table below comes back with it and
this item reopens exactly as written.

<details>
<summary>The original count, kept for that eventuality</summary>

| Notation | Files |
|---|---|
| `sq ft` | shikhar.ts |
| `sq. ft.` | rudra.ts |
| `sq.ft` / `sq.ft.` | prithvi.ts, ishaan.ts, shaurya.ts |
| `sq.m` | shaurya.ts |
| `sq. m.` | dhruva.ts |
| `sq.mt` | ishaan.ts |

`src/data/shaurya.ts:154` mixes two on a single line (`19.316 sq.m` and `208 sq.ft` in one comment). Pick a house style.
</details>

### 10. Footer address format — **done, 11 Aug 2026**
`site.ts` now reads `Navi Mumbai, Maharashtra, 410206`, matching the comma
every project address uses before its pincode.

---

## SEO — started 10 Aug 2026, finish across the remaining pages

### 11. Structured data + heading descriptors — roll out to every page
Started on 10 Aug 2026 on `feat/inline-edit`, **uncommitted**. Two things landed:

- **Organization JSON-LD**, built in [`src/lib/structured-data.ts`](src/lib/structured-data.ts)
  from `site.ts` and emitted into `<head>` by `BaseLayout.astro`. This one is
  already site-wide — every page has it, nothing further needed.
- **Homepage `<h1>` descriptor.** The `<h1>` was `Your Trust / Our Foundation.` —
  a promise that names neither the trade nor the region. An `sr-only` span inside
  the existing `<h1>` now appends `home.hero.headlineNote`. The visible design is
  untouched.

Note the heading audit came back cleaner than expected: **every page already has
exactly one `<h1>`**, and the flagship line is already an `<h2>`. There is no
hierarchy bug to fix. What is left is thin `<h1>` *text*:

| Page | Current `<h1>` | Problem |
|---|---|---|
| `/projects` | "Every project, a promise we keep." | Slogan; no trade, no region |
| `/gallery` | "Gallery" | One generic word |
| `/projects/<slug>` | Bare project name ("Shikhar") | No type, no locality |

Same `sr-only` treatment as the homepage, or rewrite the visible text — the
second is better where the line can carry it. **The hidden text must restate
something visible on the page**; hidden text that is not corroborated on screen
is cloaking.

Then: per-project schema. `Residence` or `Product` nodes on the six project
pages, sharing the Organization node via its `@id`
(`https://nestingtree.in/#organization`). Nothing has been written for this yet.

### 12. Image filenames and alt text — full sweep
> **➤ SUPERSEDED BY [`IMAGE-SEO-BRIEF.md`](IMAGE-SEO-BRIEF.md), 11 Aug 2026.**
> The owner's goal is image ranking on Google, and this item covers only half of
> what that needs — it says nothing about the 4 MB photographs, the missing
> sitemap, or the fact that Astro's image optimisation is switched off entirely.
> **Start from that file, not this one.** What stays useful here is the prep
> inventory and the hazard list below.

Not started, but **the groundwork is laid — read this before starting.** Both
halves matter and they are separate jobs:

- **Filenames.** `/public/images/` currently mixes camera dumps
  (`IMG20260627115135.jpeg`, `DSC_0182.jpeg`), inconsistent casing
  (`ShikharElevationFinal.jpeg`, `Ishan-Reduced.jpg` — note the misspelling),
  and folder spellings that don't match the brand (`/Testimonials/`).
  Renaming means updating every `src/data/*.ts` reference in the same commit.
- **Alt text.** Needs an audit, not a rewrite — some is already good and
  deliberate. The stock photography in `home.intro.images` in particular has a
  **standing rule** in its own comment: alt describes only what is visible and
  says "stock photograph", never a name, project or year, because those are
  licensed Unsplash images and not our buildings or our residents. Do not
  "improve" those into project captions.

#### What was prepared — 11 Aug 2026

`node scripts/image-audit.mjs` regenerates everything below into
`.image-audit/` (gitignored). It reads `src/` and `public/`, and **writes
nothing to either**.

**The looking is the cost, and it has been cut by ~85%.** An image is billed by
its pixel area, so 83 photographs opened one at a time run to roughly 124k
tokens — more than a session wants to spend. The script tiles them six-up into
**14 contact sheets** at 1380×690, just under the size where an image starts
being downscaled. Each sheet bills as one image, so the same 83 photographs now
cost about **19k tokens** to look at, or ~210 each. Every cell carries its
worklist index burned into the top-left corner.

| Output | What it is |
|---|---|
| `.image-audit/sheets/sheet-01…14.png` | The photographs, six per sheet, **ordered worst-first** — the most-duplicated descriptions come first, so stopping early still fixes the worst of it |
| `.image-audit/WORKLIST.md` | One row per alt string: index, sheet, cell, duplicate count, current alt, and the exact file + line to edit. Has an empty `New alt` column to fill in |
| `.image-audit/worklist.tsv` | Same, tab-separated |
| `.image-audit/dead-assets.md` | 81 files under `public/images` that nothing in `src/` references |
| `.image-audit/rename-map.tsv` | **Proposed** filename map. Generated for review, never applied |

**Scope, counted rather than estimated:** 86 alt strings in `src/data/*.ts`, of
which **83 are project photographs and in scope**, and 3 are the licensed stock
in `home.intro.images` and are *out* of scope under the standing rule above.
None reference a missing file. The templates are almost entirely data-driven —
only 4 literal `alt="…"` attributes exist in `.astro` files, and 2 of those are
correctly-empty decorative images — so essentially all of this work happens in
`src/data/`.

#### ⚠️ The alt text is not merely duplicated — some of it is wrong

Sheet 01 was checked as a spot test. It holds the nine Dhruva photographs that
all read *"Dhruva — aerial view over the rooftop and surroundings"*. **They are
not aerial views of a rooftop.** They are views across the Navi Mumbai
International Airport site — runway, taxiway, terminal building, the perimeter
road with trucks on it, hills behind. Whatever the intent was, the alt text does
not describe the photograph, which is the one thing alt text has to do.

That reframes this item. It is not a tidy-up; a screen-reader user is currently
being told something untrue about nine images, and the same is likely to be true
of the other duplicate clusters (8 × Shikhar aerial, 8 × Prithvi exterior,
6 × Shaurya aerial, 6 × Ishaan exterior). **Do the alt half first.** It is the
half with a real defect in it, and it touches nothing outside `src/data/*.ts` —
no URLs change, no caches break, and it is trivially reversible.

#### ⚠️ Before renaming anything

The filenames half is the outward-facing one and should not be folded into the
same sitting:

- Everything under `/public/images/` is a **live URL**. `/images/og/*` are the
  cards WhatsApp and Facebook fetch for link previews and **those platforms
  cache them** — renaming breaks the preview on every link already shared.
  Search engines have indexed the rest.
- `/Testimonials/` → `/testimonials/` is a **case-only rename**, which needs a
  two-step `git mv` on this filesystem or git will not record it.
- The proposed convention in `rename-map.tsv` is
  `/images/projects/<slug>/photos/<slug>-<subject>-<nn>.jpg` — 81 files. It is a
  proposal, not a decision. Change it in the script and re-run.
- **Check first** whether any image path can reach the page from the database
  rather than from `src/`. A quick look at `src/lib/editable.ts` suggests the
  live editor handles text only, but that was a quick look, and the dead-asset
  list and the rename map are both only as good as that assumption.

**The dead-asset list is worth a look on its own merits.** The top entries are
unused video files and oversized `_og` variants — `Prithvi2-scrub.mp4` at 62 MB,
`Prithvi-Elevation_og.jpg` at 45 MB, `ShikharElevationFinal_og.jpeg` at 40 MB.
That is a lot of deploy weight for files nothing links to. Confirm they are
genuinely unreachable before deleting.

---

## Owner's review — 11 Aug 2026

Sir's own list, kept in **his numbering** so it can be read back to him
point-by-point. This section is deliberately not merged into the numbered items
above — those are ours, these are his, and the two orderings should not be
mixed. Items already closed have been dropped rather than restated:

- **His #12** (Ishaan: 3 homes per typical floor, 1–4) — **done**, see section A
  below. His wording is quoted there as the authority.
- **His #2** (add "just") — **done** 11 Aug 2026.
- **His #4** (About "Standard" line) — **done** 11 Aug 2026, his wording verbatim.
- **His #5** (Kailash Gindodia paragraph) — **done** 11 Aug 2026, his text verbatim.
- **His #8** (drop "not RERA-registered") — **done** 11 Aug 2026, all eight edits.
- **His #9** (room dimensions out, disclaimer in, QR out) — **done** 11 Aug 2026,
  all three parts.
- **His #10** (Prithvi: one elevator, no rooftop solar) — **done** 11 Aug 2026,
  swept through the whole file.
- **His #1** (NT logo bigger) — **done** 12 Aug 2026, `42090a8`.
- **His #3** (flat + building under each testimonial) — **done** 12 Aug 2026,
  `40cab23`.
- **His #7** (Prithvi Project Overview) — **done** 12 Aug 2026, his sentence.
- **His #11** (remove the "about the developer" section) — **done** 12 Aug 2026,
  all seven pages.
- **His #13** (carpet area off every page) — **done** 12 Aug 2026.

All of the above are described in *Cleared since launch* at the foot of this
file. **Read #10 before you touch Prithvi's lift count again** — that figure has
now moved twice, and the reason it is one is recorded in `prithvi.ts`.

Where a point touches something already on our list, the cross-reference is
noted rather than duplicated.

**Two points are still open, and both need him, not us: #6 (the two wrong
addresses) and #14 (what exactly is wrong in Ishaan's unit mix).** Nothing else
on his list is outstanding.

### 1. Landing page — the NT logo needs to be bigger — **done, 12 Aug 2026**
"The customer should know they have reached the NT page." The header lockup
([`SiteHeader.astro`](src/components/SiteHeader.astro)) turned sideways so the
mark could grow: 36px → 56px on desktop, 32px → 44px on mobile. Stacked above a
two-line wordmark it filled ~72px of an 80px bar and had nowhere to go.

⚠️ **The bar height itself must not change.** `scroll-mt-20` (80px) sits on 59
anchored sections site-wide and is matched to `lg:h-20` in the header. Grow the
bar and every jump link lands with its heading tucked underneath it. If the mark
must be bigger still, either those 59 values move too or the wordmark goes.

### 3. Testimonials — flat number and building under the name — **done, 12 Aug 2026**
`detail` now carries flat and building only, on all five. Two of them still had
the old line ("Private Employee", "Ratnagiri"), so the row was reading in two
formats side by side on the home page. **Keep the five in one format** — these
are real named residents and an exception shows.

### 6. On-going section — project addresses — **half done, 12 Aug 2026**
He raised four faults. Two are fixed and two need him:

- **Ishaan — no address shown** → fixed. **Udaan — no address shown** → fixed.
  All three card surfaces (`/`, `/projects`, `/gallery`) now print the project's
  real site address, `2a5df84`. This **reverses** the earlier city-level-only
  decision, deliberately and on his instruction.
- **Shikhar — address incorrect. Prithvi — address incorrect.** ⚠️ **STILL
  OPEN — he has not given us the right ones.** The cards currently show
  `Plot no. 73, Sector R2, Karanjade, Panvel, 410206` (Shikhar) and
  `Plot no. 277, Sector 1, Karanjade, Panvel, 410206` (Prithvi), which are the
  values already in `shikhar.ts` / `prithvi.ts` and are the ones he called
  wrong. **Ask him for both, then edit only those two files** — the cards read
  from them.

Note how they are wired, because it matters: each card reads `address` **from
the project's own data file**, never a copy in `site.ts`. That is not tidiness —
on 12 Aug 2026 a full address was typed onto the Shikhar card through the
in-page editor and it was *Udaan's* plot number, live on the home page above a
"View project" button. Wired this way the card and the project page cannot
disagree. `/thank-you` keeps the city-level `location`, because "…in Navi Mumbai
has reached the team" is a sentence a plot number would wreck.

### 7. Prithvi — rewrite Project Overview — **done, 12 Aug 2026**
`overview.intro` in [`prithvi.ts`](src/data/prithvi.ts) is now his sentence,
verbatim but for three departures recorded in a comment above it: his typo
"elevator serve" → "lift serves"; "roof-top amenities" → "a rooftop common
terrace" (no amenity schedule exists for Prithvi and the solar came out on his
#10, so the terrace is the only rooftop item we can stand behind); and the 26
1BHKs given their own clause so "on the seventh floor" lands on the 2BHK alone.

**The seventh-floor placement was the open half, and it checks out.** The
approved plan's carpet-area statement puts unit **702 at 39.512 sq. m.**, much
the largest home in the building — the only 2BHK, on the seventh floor, exactly
as he says. Swept through the floor-plan blurb, the `levels` band and the 2BHK
card as well, so the page states it once and does not contradict itself.

### 11. Projects page — remove the "about the developer" section — **done, 12 Aug 2026**
The ambiguity resolved itself on inspection: six project pages carried a dark
band whose eyebrow read **literally "About the developer"**, which is his
phrase. Shikhar carried a different block doing the same job — "Why buy at
Shikhar / The Nesting Tree advantage", six cards on the company's track record.

**Both went, on all seven pages**, so no project page now sells the company
rather than the building. `developerNotes` and `advantages` were deleted from
the data files too rather than left as unread exports, each replaced by a
comment saying what went and why; the nav "About" link and the `#developer`
anchor went with them. Git has the wording if it is ever wanted back.

`/projects` itself never had such a section — masthead, catalogue and amenities
band only — so nothing changed there.

### 13. Remove carpet area from every page — **done, 12 Aug 2026**
Done by the **first** of the two readings below: `features.areaStats = false` in
[`site.ts`](src/data/site.ts). One flag, already wired through all seven pages
*and* the "areas as per the approved plan" source line under each, so every
area figure and every source line went at once — carpet, enclosed balcony,
carpet + balcony, wrapping terrace, the "26 of 27 homes of this type" counts.

**The CIDCO research is deliberately still in the data files** — approved-plan
tables, averaging arithmetic and the `stats` rows themselves. None of it
renders. Flipping the flag back restores every figure exactly. Do not tidy
those arrays away.

Three carpet figures sat **outside** the grid, where no flag could reach them,
and were deleted by hand:
- Ishaan's `Carpet area` row in `overview.facts`, and the "≈ 17 sq.mt carpet"
  line in its `levels` band;
- Prithvi's 2BHK feature list — all four area bullets (carpet 795, balcony 80,
  built-up 1,010, super built-up 1,380) and the "super built-up of 1,380 sq.ft"
  in its blurb. That also **closes the CONFLICT note** that had been sitting in
  `prithvi.ts` since before launch: those came off the Jul 2026 render set and
  the approved plan contradicts them (the whole seventh floor is 1,925 sq. ft.
  of plinth for three flats plus lobby, lift and stair, so 1,380 cannot belong
  to one of them). The render figures are the ones that went.

Verified in the built HTML: **no page prints a carpet area.** The three
surviving mentions of the word are Udaan saying it has *none* to publish, its
"RERA carpet-area statement" line in a list of documents still owed, and the
Terms §3 catch-all — none of which is a figure.

**Two area figures do survive, and were left on purpose:** Rudra's saleable-area
badges (`340–560 sq. ft.`, `560 sq. ft.` per layout) and Dhruva's `500 sq. m.`
plot size. Neither is a carpet area — `rudra.ts` says so in its own comment, the
approved plan tops out at 226 sq. ft. of carpet — so neither falls under his
wording. **If he meant those too, say so and they are a two-minute edit.**

This also closed our item 9 — see it above.

<details>
<summary>The two readings, as they were put to him</summary>

- **Kill the whole area grid.** One edit, reversible, CIDCO research intact.
  This is the reading that squares with #9 — if sizes and layouts are tentative
  and room dimensions are gone, a precise balcony area is odd company.
- **Only the rows labelled carpet.** More work, not less: several Rudra layouts
  are left with an empty grid, and all seven `unitTypesNote` lines need
  rewriting, since every one of them opens "Carpet areas from the
  CIDCO-approved building plan…".
</details>

### 14. Ishaan — unit mix is incorrect — ⚠️ **STILL OPEN, needs him**
Part of this went with his #12: the **"Homes per floor" tile now reads 3, not
4** ([`src/data/ishaan.ts`](src/data/ishaan.ts), `overview.unitMix`). The other
two tiles read "12 · 1RK apartments" and "G+4 · Storeys". **Ask him what remains
wrong** — if it is only the homes-per-floor figure this is already closed, and
if it is the 1RK-only claim it is a different and bigger fix.

The third possibility has since gone away on its own: the **three carpet sizes
are no longer on the page at all**, hidden with the rest of the area grid by his
#13 on 12 Aug 2026. So if that was what he was looking at, this is closed too.
**Show him the page as it stands now before asking** — two of the three things
it could have meant have changed underneath the question.

---

## Worked on, still open — don't close these yet

### A. Ishaan's floor configuration — corrected 11 Aug 2026, drawings still owed
**The text fix is done and confirmed. What is still missing is artwork.**

Was item 2 ("Ishaan's 1st floor"), and it turned out to be a floor-numbering
mix-up, as suspected. **Ishaan is three homes per typical floor across floors
1–4, not four per floor across 2nd–4th.** Both give twelve; only one matches the
approved plan. The 1st floor is residential and always was.

The page had been printing both readings at once — prose saying the homes start
on the 2nd floor, directly above a table listing flats **101 / 102 / 103**.

Settled on the **RERA carpet-area statement** of the CIDCO-approved plan
(CIDCO/BP-19208/TPO(NM & K)/2024/13290, 20 Dec 2024), which records three series
of four flats each: 101/201/301/401, 102/202/302/402, 103/203/303/403.
**Then confirmed by the owner, independently and unprompted:** *"For Ishaan, the
configuration is incorrect. 3 homes per typical floor (1-4)."*

Why the renders lost, for the record: they say "(2ND TO 4TH)" and draw four
units, but they fail their own arithmetic — the 1RK sheet's "RERA CARPET AREA
17.70 SQ.MT." is just that sheet's built-up figure (71.035) divided by its own
four-unit assumption, and matches none of the three approved areas. Against that
same built-up, three approved flats is 71.6%; four drawn flats needs ~91%, which
no building reaches once walls are counted. It is also the house pattern:
Shaurya (G+4) is "Residential — floors 1 to 4" and Dhruva's series run "one per
floor, floors 1–4".

**➤ STILL OPEN — two drawings are off the page.** `Ishaan_Floor_Plan.png` and
`Ishaan_1RK_Plan.png` both draw four units and are captioned 2nd–4th, so they
contradict the corrected text beside them. Both are still on disk. `plan` is now
optional on both `FloorPlan` and `UnitType`, and a card without one renders
full-width, so the typical-floor card and the 1RK card currently carry text but
no image. **Ask the architect to reissue both against the approved plan, then
put the paths back in [`src/data/ishaan.ts`](src/data/ishaan.ts).** Ground and
terrace plans were unaffected and are still shown.

---

## Cleared since launch

### His list, second sitting — 12 Aug 2026
**His 1, 3, 7, 11 and 13, plus half of his 6** — and our 9 fell out for free.
`astro build` passes and every change was checked in the rendered HTML, not just
in the source. Each item is written up under his own numbering above; the short
version:

| His | What landed |
|---|---|
| 1 | Header lockup turned sideways so the mark could grow 36→56px. **The bar height must not change** — `scroll-mt-20` on 59 sections depends on it |
| 3 | Flat + building under all five testimonial names, one format |
| 6 | Ishaan and Udaan addresses now on the cards, read from each project's own data file. **Shikhar's and Prithvi's are still the wrong ones — he owes us those two** |
| 7 | Prithvi's Project Overview is his sentence; the 2BHK is stated as seventh-floor, which the approved plan confirms (unit 702) |
| 11 | The developer band is gone from all seven project pages — six "About the developer", plus Shikhar's "Nesting Tree advantage" |
| 13 | `features.areaStats = false` takes every area figure off every page; three carpet figures outside the grid deleted by hand |

Two judgement calls worth knowing about, both flagged to him rather than
buried: **#11 took Shikhar's block too** even though its eyebrow reads "Why buy
at Shikhar", because it does the same job as the six that say "About the
developer"; and **#13 left two figures standing** — Rudra's saleable-area badges
and Dhruva's plot size — because neither is a carpet area.

Nothing in this sitting invented a fact or decided a figure. Where his wording
was ambiguous it is quoted in a comment beside the code, with the reasoning.

### The mechanical pass — 11 Aug 2026
Ten items in one sweep: **our 3, 4, 5 and 10**, and **his 2, 4, 5, 8, 9 and 10**.
Everything here was fully specified before it was started — no wording was
invented and no figure was decided. `astro build` passes and every change below
was checked in the rendered HTML, not just in the source.

**Sales contact is now defined once** (our 3 + 4). `sales` lives in
[`site.ts`](src/data/site.ts) and all seven project pages import it from there;
the seven copies in `src/data/<slug>.ts` are gone, each replaced by a comment
saying where it went. `phone` and `phoneHref` are **derived from
`contact.phone`**, so the number is written down exactly once on the site — which
is also why `contact.phone` must keep its `+91 ` and its spacing. Two things fell
out of that:

- the number now reads `+91 95940 79317` on the project pages too, where it used
  to be a bare `95940 79317`;
- the **Office** row appears on all seven pages instead of three. That was not
  only a data gap as this file assumed — the `<p>` for it existed only in
  `rudra` / `dhruva` / `shaurya`, so the markup was copied into the other four.

**Stale comments** (our 5). All four in `ishaan.ts` and both in `shaurya.ts`.
`amenitiesNeeded` is deleted from `ishaan.ts`, along with the "Still needed"
list in `ishaan.astro` that was its only reader — the empty-amenities panel
itself is kept, since that is what renders if `amenityGroups` is ever emptied.
Two more were fixed that this file had not caught, both stale for the same
reason: `ishaan.ts` still described its flat numbers and floor range as a "live
contradiction" after section A settled them, and the `rooms` commentary across
five files went stale the moment his #9 landed.

**Footer address** (our 10) — comma, not en dash.

**"We don't just sell flats."** (his 2). The array was re-split by hand to
`["We don't just sell", "flats. We deliver", "joy, built to last."]` — 18 / 17 /
20 characters, so the display type stays balanced.

**About page** (his 4, his 5). Both his wording, verbatim, with a comment above
each recording that it is his and must not be paraphrased back.

**"not RERA-registered" is gone** (his 8). All eight, across `ishaan` /
`prithvi` / `shaurya` / `udaan`, each keeping its positive half. Nothing false
appears in its place: the hero MahaRERA pill on those projects is still hidden
by `maharera: TBD`, and the site-wide footer still says "MahaRERA numbers shown
on registered project pages".

**Room dimensions out, disclaimer in, QR out** (his 9 — he marked the
disclaimer critical). The `rooms` arrays and their type declarations are gone
from every data file and the render block from every page. The disclaimer is
**one string**, `brand.sizesNote` in `site.ts`, imported by all seven pages and
printed in a slim band directly above the footer, so it is the last thing read.
`QrBlock.astro` is deleted outright along with its seven call sites.

**Prithvi: one lift, no solar** (his 10). A real sweep, not one line — overview
prose, `overview.facts`, two `floorPlans` entries, the amenity tile, the
"Why Prithvi" card, and the file header. Rooftop solar is removed, not softened.
⚠️ The lift count has now moved **twice** (one → two on an earlier confirmation,
two → one on his 11 Aug review). The history is recorded at the top of
[`prithvi.ts`](src/data/prithvi.ts) — read it before anyone changes it a third
time.

**Not touched, on purpose:** his **13** (carpet area) was raised and deferred —
see that item for the one question that unblocks it. Our **6**, **7** and **9**
need a house-style call. Our **8** turned out to be moot (the string no longer
exists). Everything else on this list needs information only you have.

### Social media links — 11 Aug 2026
Was item 1. The three dead `href: "#"` tiles (IG / FB / IN) are gone. Instagram
is the only profile that exists, so `contact.socials` now holds one entry
pointing at `https://www.instagram.com/nestingtree/`; Facebook and LinkedIn were
removed rather than left pointing nowhere.

The tile now carries an Instagram glyph instead of the letters "IG". That made
the block too big to keep copy-pasted into eleven footers, so it moved into
[`src/components/SocialLinks.astro`](src/components/SocialLinks.astro) — which
is now the only place the footer social row exists.

Two things fell out for free: `sameAs` in the Organization JSON-LD lights up
with a real URL (the filter in `structured-data.ts` was already written for
this), and emptying `contact.socials` now hides the row cleanly, wrapper and
all, if the profile ever goes away.

---

## Already done before launch (for reference)

- Ishaan address → `Plot no. 123, Sector 1, Karanjade, Panvel, 410206`
- Thank-you page: `on+91 95940 79317` spacing bug fixed (both success and error paths)
- Vipin confirmed as sole contact — "unverified" caveats removed from three files
- Parent company unified to **K.D. Construction** across 9 files
- About page MahaRERA claim softened to "where registered" — *superseded
  11 Aug 2026 by his #4, which replaced the line with "RERA registered where
  necessary". The qualifier survives the rewrite, which is the only reason the
  rewrite was safe. Do not let a later edit drop it.*
- `/privacy` and `/terms` written and wired into all three footers
