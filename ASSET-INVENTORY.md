# Asset inventory — every image and video the site uses

**Generated 2026-08-13 by `node scripts/asset-inventory.mjs`. Do not hand-edit —
re-run it instead.** Run `npm run build` first: the script reads the built HTML
as well as `src/`, and a stale build gives a stale answer.

| | Files | Size |
|---|---|---|
| **Used** — referenced from `src/` or present in the build | 229 | 63.5 MB |
| **Superseded originals** — full-res masters behind a 301, pruned from `dist/` | 103 | 264.3 MB |
| **Orphans** — referenced by nothing | 0 | 0.0 MB |
| Other files left alone (favicons, documents) | 3 | 0.3 MB |

## How to read this

- **Used** is the safe list. Deleting anything here breaks a page.
- **Superseded** is not rubbish. Each is the only full-resolution copy of a
  photograph outside git, its URL still 301s via `src/middleware.ts`, and
  `scripts/prune-superseded-images.mjs` already keeps it out of the deploy. It
  costs nothing to keep and cannot be regenerated from the WebP.
- Image paths **cannot** come from the database — `content_edits` stores text
  only. `src/` plus the build is therefore the complete picture. Re-check that
  if the in-page editor ever learns to change an image.

## Used assets, by folder

### `//` — 3 files, 0.1 MB

| File | Size |
|---|---|
| `apple-touch-icon.png` | 40 KB |
| `favicon-96.png` | 15 KB |
| `favicon.ico` | 9 KB |

### `/images/` — 1 file, 0.7 MB

| File | Size |
|---|---|
| `Kd_Sir.webp` | 758 KB |

### `/images/brand/` — 2 files, 0.4 MB

| File | Size |
|---|---|
| `logo-full.png` | 225 KB |
| `logo-mark.png` | 180 KB |

### `/images/bridge/` — 3 files, 0.4 MB

| File | Size |
|---|---|
| `family-rooftop.jpg` | 203 KB |
| `family-together.jpg` | 143 KB |
| `family-home.jpg` | 97 KB |

### `/images/og/` — 7 files, 0.5 MB

| File | Size |
|---|---|
| `dhruva.jpg` | 108 KB |
| `rudra.jpg` | 68 KB |
| `prithvi.jpg` | 66 KB |
| `default.jpg` | 61 KB |
| `shikhar.jpg` | 61 KB |
| `shaurya.jpg` | 57 KB |
| `ishaan.jpg` | 52 KB |

### `/images/Project_Images/Ishaan/` — 1 file, 2.6 MB

| File | Size |
|---|---|
| `DSC_0101.jpeg` | 2677 KB |

### `/images/Project_Images/Prithvi/` — 2 files, 7.1 MB

| File | Size |
|---|---|
| `DSC_0093.jpeg` | 4161 KB |
| `DSC_0091.jpeg` | 3067 KB |

### `/images/Project_Images/Shaurya/` — 1 file, 2.7 MB

| File | Size |
|---|---|
| `IMG20260627134928.jpeg` | 2815 KB |

### `/images/projects/` — 17 files, 23.2 MB

| File | Size |
|---|---|
| `about.mp4` | 4743 KB |
| `Shaurya_Backdrop.mp4` | 2524 KB |
| `Dhruva_Backdrop.mp4` | 2481 KB |
| `construction.mp4` | 2332 KB |
| `Rudrar_Backdrop.mp4` | 2114 KB |
| `ishaan.mp4` | 1688 KB |
| `Prithvi-Elevation.webp` | 1333 KB |
| `Rudra.jpg` | 1255 KB |
| `prithvi_backdrop.mp4` | 1245 KB |
| `ShikharElevationFinal.webp` | 1203 KB |
| `homepage_video.mp4` | 1041 KB |
| `Shikhar_Backdrop.mp4` | 851 KB |
| `Ishan-Reduced.jpg` | 582 KB |
| `Dhruva-Elevation_image.jpg` | 149 KB |
| `security.png` | 124 KB |
| `homepage-poster.jpg` | 56 KB |
| `udaan-placeholder.svg` | 3 KB |

### `/images/projects/dhruva/` — 4 files, 0.8 MB

| File | Size |
|---|---|
| `Ground_Floor_Plan.webp` | 305 KB |
| `Typical_Floor_Plan_Dhurva.webp` | 248 KB |
| `1BHK_Render_Dhurva.webp` | 168 KB |
| `1RK_Render_Dhurva.webp` | 143 KB |

### `/images/projects/dhruva/photos/` — 41 files, 4.4 MB

| File | Size |
|---|---|
| `dhruva-exterior-03.webp` | 298 KB |
| `dhruva-aerial-view-01.webp` | 293 KB |
| `dhruva-aerial-view-09.webp` | 283 KB |
| `dhruva-corridor-03.webp` | 273 KB |
| `dhruva-render-01.webp` | 272 KB |
| `dhruva-aerial-view-08.webp` | 272 KB |
| `dhruva-aerial-view-07.webp` | 254 KB |
| `dhruva-aerial-view-06.webp` | 218 KB |
| `dhruva-aerial-view-04.webp` | 202 KB |
| `dhruva-aerial-view-02.webp` | 200 KB |
| `dhruva-exterior-01.webp` | 175 KB |
| `dhruva-exterior-02.webp` | 142 KB |
| `dhruva-aerial-view-05.webp` | 133 KB |
| `dhruva-lobby-02.webp` | 129 KB |
| `dhruva-lobby-03.webp` | 116 KB |
| `dhruva-aerial-view-03.webp` | 114 KB |
| `dhruva-lift-02.webp` | 113 KB |
| `dhruva-lobby-01.webp` | 105 KB |
| `dhruva-corridor-01.webp` | 93 KB |
| `dhruva-aerial-view-09-640.webp` | 73 KB |
| `dhruva-lift-01.webp` | 66 KB |
| `dhruva-exterior-03-640.webp` | 60 KB |
| `dhruva-corridor-02.webp` | 59 KB |
| `dhruva-aerial-view-08-640.webp` | 54 KB |
| `dhruva-aerial-view-01-640.webp` | 49 KB |
| `dhruva-aerial-view-07-640.webp` | 48 KB |
| `dhruva-aerial-view-06-640.webp` | 39 KB |
| `dhruva-aerial-view-02-640.webp` | 35 KB |
| `dhruva-exterior-01-640.webp` | 35 KB |
| `dhruva-aerial-view-04-640.webp` | 33 KB |
| `dhruva-corridor-03-640.webp` | 31 KB |
| `dhruva-exterior-02-640.webp` | 30 KB |
| `dhruva-lobby-02-640.webp` | 30 KB |
| `dhruva-aerial-view-05-640.webp` | 28 KB |
| `dhruva-lobby-03-640.webp` | 27 KB |
| `dhruva-lobby-01-640.webp` | 26 KB |
| `dhruva-corridor-01-640.webp` | 25 KB |
| `dhruva-lift-02-640.webp` | 25 KB |
| `dhruva-aerial-view-03-640.webp` | 23 KB |
| `dhruva-corridor-02-640.webp` | 14 KB |
| `dhruva-lift-01-640.webp` | 13 KB |

### `/images/projects/ishaan/` — 4 files, 0.7 MB

| File | Size |
|---|---|
| `Ishaan_Ground_Plan.webp` | 324 KB |
| `Ishaan_Terrace_Plan.webp` | 184 KB |
| `Ishaan_Floor_Plan.webp` | 100 KB |
| `Ishaan_1RK_Plan.webp` | 77 KB |

### `/images/projects/ishaan/photos/` — 18 files, 2.6 MB

| File | Size |
|---|---|
| `ishaan-interior-02.webp` | 294 KB |
| `ishaan-interior-01.webp` | 285 KB |
| `ishaan-exterior-03.webp` | 282 KB |
| `ishaan-interior-03.webp` | 277 KB |
| `ishaan-interior-04.webp` | 267 KB |
| `ishaan-exterior-01.webp` | 221 KB |
| `ishaan-exterior-05.webp` | 220 KB |
| `ishaan-exterior-02.webp` | 195 KB |
| `ishaan-exterior-04.webp` | 156 KB |
| `ishaan-interior-03-640.webp` | 75 KB |
| `ishaan-interior-04-640.webp` | 73 KB |
| `ishaan-interior-01-640.webp` | 68 KB |
| `ishaan-interior-02-640.webp` | 55 KB |
| `ishaan-exterior-03-640.webp` | 45 KB |
| `ishaan-exterior-05-640.webp` | 44 KB |
| `ishaan-exterior-01-640.webp` | 42 KB |
| `ishaan-exterior-02-640.webp` | 39 KB |
| `ishaan-exterior-04-640.webp` | 36 KB |

### `/images/projects/prithvi/` — 4 files, 0.8 MB

| File | Size |
|---|---|
| `Prithvi_Terrace_Plan.webp` | 256 KB |
| `Prithvi_Floor_Plan.webp` | 223 KB |
| `Prithvi_2BHK_Plan.webp` | 214 KB |
| `Prithvi_1BHK_Plan.webp` | 78 KB |

### `/images/projects/prithvi/photos/` — 12 files, 1.8 MB

| File | Size |
|---|---|
| `prithvi-exterior-05.webp` | 274 KB |
| `prithvi-exterior-02.webp` | 265 KB |
| `prithvi-exterior-06.webp` | 264 KB |
| `prithvi-exterior-04.webp` | 244 KB |
| `prithvi-exterior-03.webp` | 238 KB |
| `prithvi-exterior-01.webp` | 231 KB |
| `prithvi-exterior-05-640.webp` | 76 KB |
| `prithvi-exterior-03-640.webp` | 65 KB |
| `prithvi-exterior-04-640.webp` | 59 KB |
| `prithvi-exterior-06-640.webp` | 58 KB |
| `prithvi-exterior-02-640.webp` | 50 KB |
| `prithvi-exterior-01-640.webp` | 46 KB |

### `/images/projects/rudra/` — 7 files, 0.7 MB

| File | Size |
|---|---|
| `plan-fourth.webp` | 279 KB |
| `plan-ground.webp` | 257 KB |
| `unit-1bhk-560.jpg` | 61 KB |
| `unit-1rk-440.jpg` | 32 KB |
| `unit-1rk-450.jpg` | 31 KB |
| `unit-1rk-340.jpg` | 29 KB |
| `unit-1rk-425.jpg` | 24 KB |

### `/images/projects/rudra/photos/` — 34 files, 4.6 MB

| File | Size |
|---|---|
| `rudra-aerial-view-05.webp` | 300 KB |
| `rudra-rooftop-01.webp` | 288 KB |
| `rudra-parking-01.webp` | 283 KB |
| `rudra-aerial-view-03.webp` | 281 KB |
| `rudra-aerial-view-04.webp` | 277 KB |
| `rudra-entrance-01.webp` | 276 KB |
| `rudra-parking-02.webp` | 262 KB |
| `rudra-exterior-02.webp` | 261 KB |
| `rudra-rooftop-02.webp` | 251 KB |
| `rudra-exterior-03.webp` | 249 KB |
| `rudra-aerial-view-02.webp` | 245 KB |
| `rudra-entrance-02.webp` | 230 KB |
| `rudra-exterior-01.webp` | 188 KB |
| `rudra-aerial-view-01.webp` | 180 KB |
| `rudra-lift-01.webp` | 155 KB |
| `rudra-corridor-02.webp` | 96 KB |
| `rudra-corridor-01.webp` | 70 KB |
| `rudra-rooftop-01-640.webp` | 67 KB |
| `rudra-aerial-view-05-640.webp` | 66 KB |
| `rudra-aerial-view-04-640.webp` | 64 KB |
| `rudra-aerial-view-02-640.webp` | 62 KB |
| `rudra-parking-01-640.webp` | 61 KB |
| `rudra-exterior-02-640.webp` | 55 KB |
| `rudra-entrance-01-640.webp` | 55 KB |
| `rudra-parking-02-640.webp` | 55 KB |
| `rudra-aerial-view-03-640.webp` | 53 KB |
| `rudra-rooftop-02-640.webp` | 50 KB |
| `rudra-exterior-03-640.webp` | 47 KB |
| `rudra-exterior-01-640.webp` | 41 KB |
| `rudra-aerial-view-01-640.webp` | 34 KB |
| `rudra-entrance-02-640.webp` | 32 KB |
| `rudra-lift-01-640.webp` | 29 KB |
| `rudra-corridor-02-640.webp` | 18 KB |
| `rudra-corridor-01-640.webp` | 18 KB |

### `/images/projects/shaurya/` — 6 files, 1.3 MB

| File | Size |
|---|---|
| `Shaurya_Ground_Plan.webp` | 324 KB |
| `Shaurya_1RK_Plan.webp` | 276 KB |
| `Shaurya_Elevation.webp` | 235 KB |
| `Shaurya_Floor_Plan.webp` | 185 KB |
| `Shaurya_1BHK_Plan.webp` | 175 KB |
| `Shaurya_Terrace_Plan.webp` | 165 KB |

### `/images/projects/shaurya/photos/` — 28 files, 3.3 MB

| File | Size |
|---|---|
| `shaurya-parking-03.webp` | 294 KB |
| `shaurya-aerial-view-06.webp` | 293 KB |
| `shaurya-rooftop-01.webp` | 286 KB |
| `shaurya-exterior-03.webp` | 275 KB |
| `shaurya-parking-02.webp` | 265 KB |
| `shaurya-parking-01.webp` | 242 KB |
| `shaurya-exterior-02.webp` | 228 KB |
| `shaurya-exterior-01.webp` | 196 KB |
| `shaurya-aerial-view-04.webp` | 172 KB |
| `shaurya-aerial-view-01.webp` | 146 KB |
| `shaurya-aerial-view-02.webp` | 129 KB |
| `shaurya-aerial-view-05.webp` | 114 KB |
| `shaurya-corridor-01.webp` | 101 KB |
| `shaurya-aerial-view-03.webp` | 85 KB |
| `shaurya-aerial-view-06-640.webp` | 80 KB |
| `shaurya-exterior-03-640.webp` | 62 KB |
| `shaurya-parking-02-640.webp` | 56 KB |
| `shaurya-exterior-02-640.webp` | 55 KB |
| `shaurya-parking-03-640.webp` | 46 KB |
| `shaurya-parking-01-640.webp` | 43 KB |
| `shaurya-exterior-01-640.webp` | 41 KB |
| `shaurya-aerial-view-04-640.webp` | 40 KB |
| `shaurya-rooftop-01-640.webp` | 35 KB |
| `shaurya-aerial-view-01-640.webp` | 32 KB |
| `shaurya-aerial-view-02-640.webp` | 30 KB |
| `shaurya-aerial-view-05-640.webp` | 25 KB |
| `shaurya-aerial-view-03-640.webp` | 20 KB |
| `shaurya-corridor-01-640.webp` | 13 KB |

### `/images/projects/shikhar/` — 3 files, 0.7 MB

| File | Size |
|---|---|
| `plan-1bhk-terrace.jpg` | 260 KB |
| `plan-1bhk.jpg` | 242 KB |
| `plan-1rk.jpg` | 182 KB |

### `/images/projects/shikhar/photos/` — 26 files, 3.7 MB

| File | Size |
|---|---|
| `shikhar-aerial-view-07.webp` | 298 KB |
| `shikhar-aerial-view-06.webp` | 281 KB |
| `shikhar-exterior-03.webp` | 279 KB |
| `shikhar-aerial-view-05.webp` | 277 KB |
| `shikhar-aerial-view-08.webp` | 273 KB |
| `shikhar-aerial-view-02.webp` | 272 KB |
| `shikhar-aerial-view-01.webp` | 252 KB |
| `shikhar-exterior-02.webp` | 237 KB |
| `shikhar-exterior-04.webp` | 236 KB |
| `shikhar-aerial-view-03.webp` | 232 KB |
| `shikhar-exterior-01.webp` | 208 KB |
| `shikhar-interior-01.webp` | 130 KB |
| `shikhar-aerial-view-04.webp` | 114 KB |
| `shikhar-aerial-view-06-640.webp` | 68 KB |
| `shikhar-aerial-view-05-640.webp` | 66 KB |
| `shikhar-aerial-view-07-640.webp` | 64 KB |
| `shikhar-aerial-view-01-640.webp` | 61 KB |
| `shikhar-aerial-view-02-640.webp` | 59 KB |
| `shikhar-exterior-03-640.webp` | 54 KB |
| `shikhar-exterior-04-640.webp` | 51 KB |
| `shikhar-aerial-view-03-640.webp` | 49 KB |
| `shikhar-exterior-02-640.webp` | 47 KB |
| `shikhar-aerial-view-08-640.webp` | 46 KB |
| `shikhar-exterior-01-640.webp` | 42 KB |
| `shikhar-interior-01-640.webp` | 31 KB |
| `shikhar-aerial-view-04-640.webp` | 25 KB |

### `/images/Testimonials/` — 5 files, 0.5 MB

| File | Size |
|---|---|
| `Vijay_Pagare.jpeg` | 169 KB |
| `Karthik_S_Salian.jpeg` | 144 KB |
| `Navin_Ravindra_Salvi.jpeg` | 124 KB |
| `Uttam.jpeg` | 18 KB |
| `Swapnil.jpeg` | 13 KB |

## Orphans

None — every file under `public/images/` is either used or a superseded original.

## ⚠ Unreferenced, but NOT in git — never auto-deleted

Nothing references these, and git has no copy under **any** name, so deleting
one is permanent. Usually that means a file was added recently and has not been
wired up yet. **Wire it up, commit it, or delete it by hand — the script will
not touch it.**

Check the second half before trusting this heading: a file can be untracked
under its own name and still be safe to delete, because git holds the identical
bytes under a different one. Compare `git hash-object <file>` against the blob
hashes in history before calling a deletion permanent.

None at present.

`Rudra_Backdrop.mp4` (1458 KB) was listed here and deleted on 13 Aug 2026. It
was a hand-made backup of the old Rudra hero video, taken just before the new
one was dropped in over `Rudrar_Backdrop.mp4` — note the typo'd name, which is
the one [`rudra.astro`](src/pages/projects/rudra.astro) actually references and
the reason the backup looked orphaned. Nothing pointed at it but this table.
Its bytes are blob `e4608f0`, still in history as `Rudrar_Backdrop.mp4` up to
`4b9a74b`, so the delete cost nothing:

    git show 4b9a74b:public/images/projects/Rudrar_Backdrop.mp4 > restored.mp4

## Left alone deliberately

Unreferenced, but not media under `/images/` — the script never deletes these.

| File | Size |
|---|---|
| `/icon-512.png` | 327 KB |
| `/nesting tree content (1).docx` | 18 KB |
| `/favicon.svg` | 1 KB |
