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

### 9. Six notations for the same units
| Notation | Files |
|---|---|
| `sq ft` | shikhar.ts |
| `sq. ft.` | rudra.ts |
| `sq.ft` / `sq.ft.` | prithvi.ts, ishaan.ts, shaurya.ts |
| `sq.m` | shaurya.ts |
| `sq. m.` | dhruva.ts |
| `sq.mt` | ishaan.ts |

`src/data/shaurya.ts:154` mixes two on a single line (`19.316 sq.m` and `208 sq.ft` in one comment). Pick a house style.

**Still full size.** The re-scope this item was waiting on has not happened:
owner's #13 (carpet area out) was deferred on 11 Aug 2026, so every square-unit
notation is still on the page. Room dimensions did go, which removes the `m`
suffixes from the unit cards but none of the `sq …` notations above.

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

All of the above are described in *Cleared since launch* at the foot of this
file. **Read #10 before you touch Prithvi's lift count again** — that figure has
now moved twice, and the reason it is one is recorded in `prithvi.ts`.

Where a point touches something already on our list, the cross-reference is
noted rather than duplicated.

### 1. Landing page — the NT logo needs to be bigger
"The customer should know they have reached the NT page." The only logo in the
viewport is `brand.logoMark` in the header
([`src/components/SiteHeader.astro:64`](src/components/SiteHeader.astro#L64)) —
the home hero carries no mark of its own. Either scale the header mark up or
give the hero its own lockup; the second is what actually answers the note.

### 3. Testimonials — add flat number and building under the name
[`src/data/site.ts:687`](src/data/site.ts#L687). Each item has `name` and
`detail`; `detail` currently holds an occupation or a home town ("Private
Employee", "Ratnagiri"). Vipin has the flat numbers and buildings. Decide
whether the flat replaces `detail` or sits beside it — three of these are real
named residents, so the change is visible and should be consistent across all
of them.

### 6. On-going section — project addresses
Four separate faults, and they are not all the same kind:
- **Shikhar** — address incorrect
- **Prithvi** — address incorrect
- **Ishaan** — no address shown
- **Udaan** — no address shown

Note the listing cards deliberately carry only `location: "Navi Mumbai"` — the
precise address lives on each project's own page, by an explicit decision
commented at [`src/data/site.ts:160`](src/data/site.ts#L160). So this needs a
decision first: does the on-going band start showing full addresses (reversing
that call), or is he reading the project pages? Ishaan and Udaan both *do* have
addresses on their own pages, which suggests he means the band. **Get the two
correct addresses from him in the same conversation.**

### 7. Prithvi — rewrite Project Overview
His text:

> A G+7 structure of 27 residential and 4 commercial units: four shops holding
> the ground floor, and 26 one-bedroom apartments plus a single 2BHK on the
> seventh floor. One automatic high-speed elevator serve every floor, with
> roof-top amenities.

Two things to settle before pasting: "elevator serve" is his typo for "serves",
and this sentence says the 2BHK is **on the seventh floor**, which the current
copy does not state. Confirm that placement — it is a sellable fact.

Note the elevator half of this point is **already done** — it was the same
instruction as his #10, and `prithvi.ts` now says one lift everywhere. What is
still waiting is the seventh-floor placement of the 2BHK, and only that.

### 11. Projects page — remove the "about the developer" section
Needs one clarification before touching anything: `/projects` itself has only a
masthead, the catalogue and the amenities band — no developer section. The
individual project pages each carry a **"Nesting Tree Advantage"** block
(e.g. [`shikhar.astro:642`](src/pages/projects/shikhar.astro#L642)), which is
almost certainly what he means. Confirm which, then remove it from all seven.

### 13. Remove carpet area from every page — **deliberately deferred, 11 Aug 2026**
The counterpart to #9, and the larger of the two. This removes the three-series
carpet table on Ishaan, the `stats` carpet rows on every project, and the
`Carpet area` row in each `overview.facts`. Check `unitTypesNote` and the
equivalent source lines too — several of them exist only to caveat a carpet
figure and become orphans once it goes.

**Why it is still open.** It was put up alongside #9 on 11 Aug 2026 and held
back on purpose, because "carpet area" does not cleanly name what is on the
cards. The same grid also carries **enclosed balcony**, **carpet + balcony**,
**wrapping terrace** and **"37 of 58 homes of this type"** — none of which is a
carpet area, and only the first two of which obviously go with it. Two readings,
and they produce different pages:

- **Kill the whole area grid.** One edit: `features.areaStats = false` in
  [`site.ts`](src/data/site.ts). That flag already exists and is already wired
  through all seven pages *and* the "areas as per the approved plan" source line
  under each, so every area figure and every source line goes at once,
  reversibly, with the CIDCO research left intact in the data files. Then delete
  the `Carpet area` row from each `overview.facts` by hand. This is the reading
  that squares with #9 — if sizes and layouts are tentative and room dimensions
  are gone, a precise balcony area is odd company.
- **Only the rows labelled carpet.** More work, not less: several Rudra layouts
  are left with an empty grid, and all seven `unitTypesNote` lines need
  rewriting, since every one of them opens "Carpet areas from the
  CIDCO-approved building plan…".

**Ask him which, then it is mechanical either way.** Until then item 9 above
(six unit notations) cannot be re-scoped, because it is mostly the same text.

### 14. Ishaan — unit mix is incorrect
Part of this went with his #12: the **"Homes per floor" tile now reads 3, not
4** ([`src/data/ishaan.ts`](src/data/ishaan.ts), `overview.unitMix`). The other
two tiles read "12 · 1RK apartments" and "G+4 · Storeys". **Ask him what remains
wrong** — if it is only the homes-per-floor figure this is already closed, and
if it is the 1RK-only claim or the three carpet sizes it is a different and
bigger fix.

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
