# Nesting Tree — post-launch punch list

Everything deferred from the pre-launch pass on **28 July 2026**. Nothing here
blocks the site going live; all of it is worth clearing afterwards.

Items are grouped by whether they need a decision from you or can just be done.

---

## Needs a decision / data from you

### 1. Social media links — the last dead links on the site
`contact.socials` in [`src/data/site.ts`](src/data/site.ts) is still
`[{ IG: "#" }, { FB: "#" }, { IN: "#" }]`. These render as clickable
buttons in the footer of **10 pages** and go nowhere.

One edit in one file fixes all ten. Either:
- paste the real Instagram / Facebook / LinkedIn URLs, or
- set `socials: []` to hide the icons until the profiles exist.

### 2. Ishaan's 1st floor
Floor plans run ground → 2nd–4th → terrace. A G+4 with 12 homes has an
unexplained 1st floor. Nothing on the page states anything false, but a buyer
will ask. Deferred at launch by choice. Needs the drawing or a one-line answer
(parking? amenity? residential?). If residential, the homes count needs
rechecking — 4 homes × floors 1–4 is 16, not 12.

### 3. Legal pages need a lawyer's eyes
`/privacy` and `/terms` were drafted to be accurate to what the site actually
does, but they are **not legal advice and have not been reviewed**. Two
placeholders to fill:
- the Grievance Officer's name (privacy, §8)
- the registered office address / CIN, if you want them shown

The clause that matters most commercially is **Terms §3** — renders and plans
are indicative, nothing on the site is an offer, the Agreement for Sale
prevails. Don't let anyone soften that.

### 4. Missing content
- **Ishaan and Shaurya have no interior finishes spec.** Shikhar and Rudra both
  have an "Interiors" amenity group (tiles, fittings, windows); these two have
  none, so they show 2 groups where peers show 3.
- **Ishaan's gallery is the thinnest on the site** — 10 photos in 2 categories
  (Exterior, Interior) vs Rudra's 17 across 7. No aerial, entrance, lift,
  parking or rooftop shots.

---

## Can just be done — no input needed

### 5. Consolidate the sales contact
Vipin is confirmed as the single point of contact for every project and for
Nesting Tree itself, but the `sales` block is copy-pasted into all six
`src/data/*.ts` files. Move it to `site.ts` and import it. Right now a phone
number change means six edits.

This also fixes: the **Office** row (1313 Realtech Park, Vashi) currently shows
on Rudra / Dhruva / Shaurya but not Shikhar / Prithvi / Ishaan, purely because
`sales.office` is set in only three of the six files.

### 6. Phone number stored two ways
`+91 95940 79317` in `site.ts`, bare `95940 79317` in every `sales` block. Same
number, rendered differently depending on the page. Folds into item 5.

### 7. Stale comments (no user-visible effect, but they mislead the next editor)
| File | Line | Says | Reality |
|---|---|---|---|
| `src/data/ishaan.ts` | ~266 | "EMPTY BY DESIGN — no amenity schedule supplied" | It's filled |
| `src/data/ishaan.ts` | ~37 | Photography "ready to hang once there is an amenity schedule" | There is one |
| `src/data/ishaan.ts` | ~168 | "Ishaan is now booking" | Status is Pre-launch |
| `src/data/ishaan.ts` | ~336 | `amenitiesNeeded` export | Dead — nothing reads it |
| `src/data/shaurya.ts` | 25, 48–49 | Pincode and sector "outstanding" | Address already has both |

### 8. Shaurya duplicates its address
It's the only project with an **Address** row inside `overview.facts`
(`src/data/shaurya.ts`), repeating what the hero already shows. Either every
page does this or none.

---

## Typography — needs one style decision, then a sweep

### 9. Apostrophes
107 straight `'` vs 5 curly `’`. The five outliers:
- `src/data/shikhar.ts:34` — `Years’ experience`
- `src/data/site.ts:180` — `can’t`
- `src/data/site.ts:198` — `that’s`
- `src/data/site.ts:220` — `you’re`
- `src/pages/projects/index.astro:240` — `aren’t`, `They’re`

They render as visibly different glyphs from the straight ones beside them.
Straight-everywhere is 5 edits; curly-everywhere is ~107 but typographically
correct for a site this polished.

### 10. Curly double quotes in exactly one place
`src/data/about.ts:84` — `“Housing for All,”`, also with the comma inside the
quote (American style) where the rest of the site is British.

### 11. Six notations for the same units
| Notation | Files |
|---|---|
| `sq ft` | shikhar.ts |
| `sq. ft.` | rudra.ts |
| `sq.ft` / `sq.ft.` | prithvi.ts, ishaan.ts, shaurya.ts |
| `sq.m` | shaurya.ts |
| `sq. m.` | dhruva.ts |
| `sq.mt` | ishaan.ts |

`src/data/shaurya.ts:132` mixes two on a single line. Pick a house style.

### 12. Footer address format
`src/data/site.ts:42` uses an en dash before the pincode
(`Maharashtra – 410206`); all six project addresses use a comma
(`Panvel, 410206`).

---

## Already done before launch (for reference)

- Ishaan address → `Plot no. 123, Sector 1, Karanjade, Panvel, 410206`
- Thank-you page: `on+91 95940 79317` spacing bug fixed (both success and error paths)
- Vipin confirmed as sole contact — "unverified" caveats removed from three files
- Parent company unified to **K.D. Construction** across 9 files
- About page MahaRERA claim softened to "where registered"
- `/privacy` and `/terms` written and wired into all three footers
