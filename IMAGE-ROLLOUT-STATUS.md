# Image rollout — status

**Written 12 Aug 2026, at the end of the session that did the work.**
Read this first. It says what landed, what did not, and what needs you.

Companion to [`IMAGE-SEO-BRIEF.md`](IMAGE-SEO-BRIEF.md), whose §1a is now
updated to match. Nothing has been pushed. Everything is on `feat/inline-edit`.

---

## The short version

Workstreams **A and B are done for all seven projects.** Eighty photographs —
the twenty from the Dhruva pilot and sixty more across five projects — were
shrunk, renamed, re-described, re-referenced and redirected. Four photographs
were deliberately left alone and need a decision from you; they are §2.

Workstream **C has not been started.** It was not in scope for this session.

```
219.5 MB of camera JPEGs  ->  16.9 MB of WebP          92.3% off
what a gallery grid now downloads first: 3.5 MB        98.4% off
```

| Project | Photos | Migrated | Parked | Original | Now | Commit |
|---|---|---|---|---|---|---|
| Dhruva | 20 (+1 plate) | 21 | — | 55.3 MB | 3.7 MB | earlier pilot |
| Shikhar | 13 | 13 | — | 37.3 MB | 3.0 MB | `47ae74b` |
| Rudra | 17 | 17 | — | 46.5 MB | 3.8 MB | `0166d69` |
| Shaurya | 15 | 14 | **1** | 36.4 MB | 2.8 MB | `b125138` |
| Ishaan | 10 | 9 | **1** | 23.2 MB | 2.1 MB | `281d91c` |
| Prithvi | 8 | 6 | **2** | 20.9 MB | 1.5 MB | `7e895a4` |
| Udaan | 0 | — | — | — | — | nothing built yet |
| **Total** | **83** | **80** | **4** | **219.5 MB** | **16.9 MB** | |

Six commits, oldest first: `7e4c288` (the checkpoint you asked for), then one
per project. **Nothing pushed.**

---

## 1. What you must check

Three things, in the order I would look at them.

### 1.1 The descriptions themselves — the review page

Fifty-nine new alt strings, each set beside the photograph it describes:

**https://claude.ai/code/artifact/8f5facf3-2082-4333-b8f2-7c8b80b48497**

This is the one piece of the work a script cannot verify. The lengths, the
banned words, the uniqueness and the encoding are all machine-checked and all
pass. Whether *"a freight train on the line below the wooded hillside"* is
actually what that photograph shows is a thing only you can confirm.

The twenty Dhruva strings from the pilot are unchanged and are not on this page;
they are on the earlier one, https://claude.ai/code/artifact/0bf422fe-5f9e-4795-93ab-9307ad8a43cb.

### 1.2 Four photographs of other people's buildings

See §2. This is the substantive finding of the session and it is a content
question, not a technical one.

### 1.3 That the site still looks right

The build passes and the markup is correct, but I have not looked at the
rendered pages in a browser. Worth five minutes on `/gallery` and on the six
project pages before this goes anywhere near production.

---

## 2. Parked — four photographs, one question

**Four of the sixty-three photographs in this rollout are not photographs of the
project they are filed under.** Each is captioned *"&lt;Project&gt; — exterior of the
building"*. Each is a real, identifiable third-party building.

| Where | File | What it actually is |
|---|---|---|
| Shaurya | `Shaurya/IMG20260627134928.jpeg` | The **Vadghar group gram panchayat office** — the signboard reads "ग्रुप ग्रामपंचायत वडघर, ता. पनवेल". A public building, in a different village |
| Ishaan | `Ishaan/DSC_0101.jpeg` | The entrance arch of **M PA SC College, Panvel** (महात्मा फुले कला, विज्ञान व वाणिज्य महाविद्यालय), photographed with its security guard and a parked car |
| Prithvi | `Prithvi/DSC_0091.jpeg` | A small blue-and-gold **roadside temple** at the foot of the rock cutting, saffron flags flying |
| Prithvi | `Prithvi/DSC_0093.jpeg` | The same temple, wider, with the shuttered row behind it |

**Why I stopped rather than describing them.** §3.3 requires the alt to end
`— <project>, Karanjade`. On a photograph of the Vadghar panchayat office that
tail is false twice: it is not Shaurya and it is not Karanjade. Writing an
honest description of the building *and* attaching a project's name to it are
mutually exclusive here, and choosing between them means deciding what the
gallery is **for** — the building, or the neighbourhood around it. That is
yours, not mine.

**Three ways out, whichever you prefer:**

1. **Remove them from the galleries.** Cleanest. They are not project
   photographs and the galleries are described in the code as "real
   photography… of this project".
2. **Keep them and give them a "Neighbourhood" category** with a tail that does
   not claim the project — e.g. `— near Prithvi, Karanjade`, or no tail at all.
   This needs a small change to §3.3, which is why I did not just do it.
3. **Keep them exactly as they are.** They are working now and always were. The
   alt text stays wrong, which is the defect this whole exercise exists to fix.

Say which and it is fifteen minutes of work.

**Consequence while they are parked:** §11's "no camera dumps left" check finds
exactly these four paths, and its "every alt is unique" check finds exactly one
duplicate pair — the two temple frames. Both are expected and both clear the
moment you decide. Nothing else in §11 has an exception.

---

## 3. Everything else I would want to know

### 3.1 Shikhar's only interior photograph is an unfinished bathroom

`Shikhar/Interior/IMG20260627131512.jpeg` — a bathroom mid fit-out: a patterned
tile feature wall, plain white tiles, and a bare concrete floor with tile debris
on it. It was captioned "Shikhar — interior of a home". It is now described
accurately, but Shikhar is the project with **bookings open**, and a debris-strewn
bathroom is its entire interior story on the site. That is a photography gap,
not an alt-text one — the same category as punch-list item 2 and §12.4.

### 3.2 Rudra's two "rooftop terrace" photographs are a bare service level

Both show unfinished concrete, columns, and roofing sheets stacked against the
parapet. They are described as that. Rudra is delivered and §6.7 forbids calling
it under construction, so the descriptions carefully do not — but the photographs
are not selling a rooftop terrace, and the site's amenity copy leans on one.

Related: §3.3's "Good" example is a Rudra rooftop *"with parapet wall and
overhead water tank, looking across low-rise rooftops to the hills"*. **No Rudra
photograph shows that.** The example illustrates the *form* of a good string, not
the content of any real file. I did not reuse it; copying it would have been the
exact defect §6.1 exists to prevent. Flagging it because the next person to read
§3.3 quickly could easily paste it in.

### 3.3 Dhruva's delivery year is still unresolved

§12.1, unchanged. `dhruva.ts` heroStats says **2023 Delivered**; the journey
timeline in `site.ts` says **2021**. Both are still live. No alt text anywhere
carries a year, so nothing here depends on it — but the contradiction is on the
site and has been since before this work started.

### 3.4 The /gallery hero is now a 1600 px file

`shaurya-aerial-view-04.webp` is the full-bleed hero on `/gallery` as well as a
gallery item and a `site.ts` amenity image. §7's table suggests 2000 px for a
hero; it is at 1600 px, because that is the tier every gallery photograph gets
and because the 300 KB budget would not have survived 2000 px on that frame.
Full-bleed on a large high-density display it will be slightly soft. If that
bothers you it wants a separate hero-tier encode, not a change to the pipeline.

Its literal `alt=` in `gallery.astro` still says the plane is "on approach". I
could not read the landing-gear state at any resolution, so my own description
says only "an aircraft passing above". I left the page's own copy alone — you
told me not to touch visible copy, and that string may be right.

### 3.5 Floor plans and unit renders are still untouched, everywhere

Carried over from the pilot and explicitly out of scope this session. Dhruva
alone has 8.31 MB of them and is now the worst case, because its photographs
dropped from 55 MB to under 1 MB on first paint. They are line art with
dimension text on it; lossy WebP is the wrong tool and squeezing them is a
legibility decision. They want their own pass with a read-the-numbers check.

---

## 4. Two bugs found in the prep script

Neither blocked the work. Both are worth fixing before anyone runs
`scripts/image-audit.mjs` again and trusts the output.

### 4.1 `rename-map.tsv` silently drops any filename containing a parenthesis

The scan that decides which files are "referenced" uses
`/\/images\/[^"'`\s)]+/g` — the character class excludes `)`. So
`DSC_0183(1).jpeg` is recorded as referenced only up to `DSC_0183`, the full
on-disk name never matches, and the file is quietly omitted from the proposed
rename map.

Three files are affected: `Shaurya/Aerial_View/DSC_0183(1).jpeg`,
`Shaurya/Exterior/DSC_0118%20(1).jpeg` and
`Ishaan/Exterior/IMG20260627122601%20(1).jpeg`. All three are in the worklist
(that part reads the data files directly and is fine) — they are missing only
from the rename map. I numbered them by hand to the §3.1 convention, which
shifted the map's proposed numbers for their siblings. **Anyone who had trusted
the rename map blindly would have skipped three photographs without noticing.**

### 4.2 The dead-assets list now contains 101 files and most are not dead

Already flagged in §9 and now more true: every original that has been renamed is
"unreferenced" by the scan's definition and is simultaneously the target of a
live 301. **80 of the 101 entries are in that state.** Do not delete anything on
that list without cross-checking `src/lib/image-redirects.ts` first.

---

## 5. What is actually verified

Machine-checked, all green except the four parked frames:

| Check | Result |
|---|---|
| `npx astro build` | passes; 13 routes prerendered |
| Every alt unique across `src/data/` | one duplicate pair — the two parked temple frames |
| No double-encoded characters in `src/` | clean (§10.2) |
| No camera-named paths in `src/data/` | four left, all parked |
| No referenced image over 300 KB | clean, all 80 files |
| Every gallery `<img>` has width/height | yes, both galleries |
| Old URL → 301 → new file | tested per project, incl. the `%20` path §7 asks for |
| Unmapped image path | still 404s, no catch-all |
| Parked originals still serve | 200, untouched |
| Line endings preserved | CRLF data files still CRLF |

Tested by hand against the built Node server, with the originals temporarily
removed from `dist/client` so the middleware was actually exercised:

```
/images/Project_Images/Shikhar/Aerial_View/DSC_0153.jpeg           301 -> shikhar-aerial-view-01.webp
/images/Project_Images/Rudra/Rooftop/IMG20260627115135.jpeg        301 -> rudra-rooftop-02.webp
/images/Project_Images/Shaurya/Aerial_View/DSC_0183(1).jpeg        301 -> shaurya-aerial-view-05.webp
/images/Project_Images/Ishaan/Exterior/IMG20260627122601%20(1).jpeg 301 -> ishaan-exterior-04.webp
/images/Project_Images/Prithvi/Exterior/DSC_0086.jpeg              301 -> prithvi-exterior-03.webp
```

**Not verified:** how any of it looks in a browser. See §1.3.

---

## 6. How to run it again

```
node scripts/image-audit.mjs                        # worklist + contact sheets
node scripts/optimise-project-images.mjs <slug>     # the whole pass, one project
```

The alt text lives in `scripts/alt-text/<slug>.tsv`, **not** in the data files —
editing a string in `src/data/*.ts` will be overwritten by the next run. Each
data file's gallery comment now says so.

The pipeline is idempotent and refuses to start if the alt text breaks §3.3 or
§6: length outside 80–125, a banned word, a year, a project named more than once,
a duplicate within the manifest, or a collision with any other alt string in
`src/data/`. It appends to the redirect map and never rewrites it, and it skips
`src/lib/image-redirects.ts` when rewriting references — that file is the one
place old URLs must survive.

---

## 7. If you want workstream C next

Nothing in it has been started. §8 of the brief still describes it accurately,
and one part is now much more valuable than it was this morning: the
per-project `Residence` schema wants the project's images attached to it, and
those images now have real filenames and real descriptions to attach.

`robots.txt` and the sitemap are each about twenty minutes. The schema is the
half-day.
