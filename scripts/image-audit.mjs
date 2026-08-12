/* ============================================================
   Image audit prep — groundwork for punch-list item 12.

   Item 12 is two jobs (alt text, filenames) and the expensive half
   is LOOKING at 83 photographs. Read one at a time they cost roughly
   1,500 tokens each; tiled six-up into contact sheets they cost about
   210 each, because an image is billed by its pixel area and a sheet
   is capped like any other image. That is the whole point of this
   script: turn ~124k tokens of looking into ~19k.

   It writes everything into .image-audit/ (gitignored) and changes
   NOTHING in src/ or public/. Re-run it any time:

     node scripts/image-audit.mjs

   Outputs:
     .image-audit/WORKLIST.md      one row per alt string, with the
                                   contact-sheet cell it appears in
     .image-audit/worklist.tsv     same data, tab-separated
     .image-audit/sheets/*.png     6-up contact sheets, index burned
                                   into each cell
     .image-audit/dead-assets.md   files under public/images that
                                   nothing in src/ references
     .image-audit/rename-map.tsv   PROPOSED filename map — generated
                                   for review, never applied
   ============================================================ */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync, copyFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, extname, basename } from "node:path";

const ROOT = process.cwd();
const OUT = join(ROOT, ".image-audit");
const THUMBS = join(OUT, "thumbs");
const SHEETS = join(OUT, "sheets");
const FFMPEG = join(ROOT, "node_modules", "ffmpeg-static", "ffmpeg.exe");
const FONT_SRC = "C:/Windows/Fonts/consola.ttf";

/* Cell size and grid. 3x2 at 460x345 gives a 1380x690 sheet — just
   under the ~1.15 MP where an image starts being downscaled, so each
   photo arrives at full cell resolution and the sheet still bills as
   one image. Raising the grid to 3x3 saves a little more but costs
   detail; six-up is the sweet spot. */
/* CELL_H MUST BE EVEN. yuv420p subsamples chroma 2:1 vertically and so
   cannot represent an odd height; ffmpeg silently rounds it down. That
   is not cosmetic — see the format lock in the filter chain below. */
const CELL_W = 460, CELL_H = 344, COLS = 3, ROWS = 2;
const PER_SHEET = COLS * ROWS;

/* Stock photography is EXCLUDED from the alt rewrite, not merely
   flagged. `home.intro.images` are licensed Unsplash images of people
   who are not our residents, in buildings that are not ours. Their alt
   text has a standing rule in site.ts: describe only what is visible,
   say "stock photograph", never name a project, person or year. They
   are listed in the worklist so nobody thinks they were missed. */
const PROTECTED = /\/images\/bridge\//;

/* Already migrated: anything living at the target convention from
   IMAGE-SEO-BRIEF.md §3.1 has been renamed, re-encoded and re-described
   already, so it is dropped from the worklist rather than re-offered.
   This matters more than it looks — the sort below is by duplicate
   count, and finishing a project changes the duplicate counts, which
   would otherwise renumber every remaining photo on each rollout pass. */
const MIGRATED = /\/images\/projects\/[^/]+\/photos\//;

/* ---------- 1. Collect every alt string in src/data ---------- */
const dataDir = join(ROOT, "src", "data");
const rows = [];

for (const name of readdirSync(dataDir).filter((f) => f.endsWith(".ts")).sort()) {
  const rel = `src/data/${name}`;
  const lines = readFileSync(join(dataDir, name), "utf8").split(/\r?\n/);
  let pending = null;

  lines.forEach((line, i) => {
    const src = line.match(/src:\s*"([^"]+)"/);
    const alt = line.match(/alt:\s*"([^"]*)"/);
    const cat = line.match(/category:\s*"([^"]*)"/);

    if (src && alt) {
      rows.push({ file: rel, line: i + 1, src: src[1], alt: alt[1], category: cat?.[1] ?? "" });
      pending = null;
      return;
    }
    if (src) { pending = { file: rel, line: i + 1, src: src[1] }; return; }
    // multi-line object literal: alt on a later line than src
    if (alt && pending && i + 1 - pending.line <= 3) {
      rows.push({ ...pending, alt: alt[1], category: "" });
      pending = null;
    }
  });
}

/* Duplicate detection — the actual defect item 12 is about. */
const altCounts = new Map();
for (const r of rows) altCounts.set(r.alt, (altCounts.get(r.alt) ?? 0) + 1);

for (const r of rows) {
  r.onDisk = existsSync(join(ROOT, "public", decodeURIComponent(r.src)));
  r.protected = PROTECTED.test(r.src);
  r.migrated = MIGRATED.test(r.src);
  r.dupes = altCounts.get(r.alt);
}

/* Order: protected last, then by duplicate count descending so the
   worst offenders land on the first sheets and a short session still
   fixes the things that matter most. */
const work = rows
  .filter((r) => !r.protected && !r.migrated && r.onDisk)
  .sort((a, b) => b.dupes - a.dupes || a.src.localeCompare(b.src));

/* ---------- 2. Thumbnails, index burned in ---------- */
rmSync(THUMBS, { recursive: true, force: true });
rmSync(SHEETS, { recursive: true, force: true });
mkdirSync(THUMBS, { recursive: true });
mkdirSync(SHEETS, { recursive: true });

/* Copy the font next to the thumbnails and reference it by a bare
   relative name. A Windows absolute path carries a drive-letter colon,
   which is the filtergraph argument separator and needs escaping that
   differs between shells — sidestepping it entirely is more robust
   than getting the escaping right. */
const fontRel = "font.ttf";
copyFileSync(FONT_SRC, join(OUT, fontRel));

work.forEach((r, idx) => {
  const n = String(idx + 1).padStart(3, "0");
  r.index = idx + 1;
  /* The crop is a clamp, not a crop. `force_original_aspect_ratio` rounds
     to whole pixels and can land one over the box on a 4:3 source, and
     `pad` refuses to pad something already larger than its target. The
     min() pair guarantees the input to pad never exceeds the cell. */
  const vf = [
    `scale=${CELL_W}:${CELL_H}:force_original_aspect_ratio=decrease`,
    `crop=min(iw\\,${CELL_W}):min(ih\\,${CELL_H})`,
    `pad=${CELL_W}:${CELL_H}:(ow-iw)/2:(oh-ih)/2:color=0x1b1b1b`,
    `drawbox=x=0:y=0:w=54:h=30:color=0x000000@0.75:t=fill`,
    `drawtext=fontfile=${fontRel}:text='${r.index}':x=8:y=4:fontsize=22:fontcolor=white`,
    /* LOCK THE PIXEL FORMAT — do not remove.
       ffmpeg picks chroma subsampling from the SOURCE: a JPEG in gives
       yuvj420p out, a PNG in gives yuvj444p. 4:4:4 also permits an odd
       height where 4:2:0 forces it even, so a single PNG among the JPEGs
       produced one 460x345 yuvj444p thumbnail among 82 that were
       460x344 yuvj420p. The tile filter cannot absorb a frame that
       changes both size and format mid-stream: it DROPPED that frame,
       and every sheet after it silently shifted by one cell. The
       burned-in index stayed right, so the sheets looked fine — the
       worklist's sheet/cell columns were the thing that lied.
       (Hit on 11 Aug 2026 at index 55, Dhruva/Corridor/corridor.png.) */
    `format=yuvj420p`,
  ].join(",");

  const res = spawnSync(FFMPEG, [
    "-hide_banner", "-loglevel", "error", "-y",
    "-i", join(ROOT, "public", decodeURIComponent(r.src)),
    "-vf", vf, "-frames:v", "1",
    join(THUMBS, `${n}.jpg`),
  ], { cwd: OUT });

  if (res.status !== 0) {
    console.error(`  ! thumbnail failed for ${r.src}: ${res.stderr?.toString().trim()}`);
    r.thumbFailed = true;
  }
});

/* ---------- 2b. Guard: every thumbnail must be identical in geometry
   and pixel format, or the tile filter will drop the odd one out and
   shift every sheet after it WITHOUT reporting an error. This check is
   the whole reason that failure is not silent any more. ---------- */
const probe = (file) => {
  const err = spawnSync(FFMPEG, ["-hide_banner", "-i", file, "-f", "null", "-"], { encoding: "utf8" }).stderr ?? "";
  const m = err.match(/Video:\s*\w+[^,]*,\s*(\w+)[^,]*,\s*(\d+x\d+)/);
  return m ? `${m[2]} ${m[1]}` : "unreadable";
};
const shapes = new Map();
for (let i = 1; i <= work.length; i++) {
  const file = join(THUMBS, `${String(i).padStart(3, "0")}.jpg`);
  const shape = probe(file);
  if (!shapes.has(shape)) shapes.set(shape, []);
  shapes.get(shape).push(i);
}
if (shapes.size > 1) {
  console.error("\nABORTING — thumbnails are not uniform, so tiling would silently drop frames:");
  for (const [shape, idx] of [...shapes].sort((a, b) => b[1].length - a[1].length)) {
    console.error(`  ${shape.padEnd(20)} ${idx.length} file(s)${idx.length <= 5 ? `: ${idx.join(", ")}` : ""}`);
  }
  console.error("\nThe minority shape is the bug. Check the source format of those indices");
  console.error("and the format lock in the filter chain above.\n");
  process.exit(1);
}

/* ---------- 3. Tile into contact sheets ---------- */
const tile = spawnSync(FFMPEG, [
  "-hide_banner", "-loglevel", "error", "-y",
  "-f", "image2", "-i", join(THUMBS, "%03d.jpg"),
  "-vf", `tile=${COLS}x${ROWS}:margin=6:padding=4:color=0x101010`,
  join(SHEETS, "sheet-%02d.png"),
]);
if (tile.status !== 0) console.error(`  ! tiling failed: ${tile.stderr?.toString().trim()}`);

/* Second guard: the sheets must account for every photograph. A frame
   silently dropped in tiling shows up here as a short sheet count. */
const expectedSheets = Math.ceil(work.length / PER_SHEET);
const actualSheets = readdirSync(SHEETS).length;
if (actualSheets !== expectedSheets) {
  console.error(`\nABORTING — ${actualSheets} sheets for ${work.length} photos, expected ${expectedSheets}.`);
  console.error("Frames were dropped in tiling; the sheet/cell columns cannot be trusted.\n");
  process.exit(1);
}

for (const r of work) {
  const zero = r.index - 1;
  r.sheet = String(Math.floor(zero / PER_SHEET) + 1).padStart(2, "0");
  r.row = Math.floor((zero % PER_SHEET) / COLS) + 1;
  r.col = (zero % COLS) + 1;
}

/* ---------- 4. Dead assets ---------- */
const referenced = new Set();
const walkSrc = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walkSrc(p);
    /* Parentheses are legal in a filename AND are the terminator in a CSS
       url(...), so they cannot simply be excluded from the character class.
       Doing that truncated every path with a "(1)" in it — three files
       across Shaurya and Ishaan silently fell out of the rename map, and
       anyone trusting the map would have skipped them without noticing.
       Match greedily instead, then peel back only the closing brackets
       that are genuinely unbalanced. */
    else for (const m of readFileSync(p, "utf8").matchAll(/\/images\/[^"'`\s]+/g)) {
      let url = m[0];
      while (url.endsWith(")") && (url.match(/\)/g) ?? []).length > (url.match(/\(/g) ?? []).length) {
        url = url.slice(0, -1);
      }
      referenced.add(decodeURIComponent(url));
    }
  }
};
walkSrc(join(ROOT, "src"));

const onDisk = [];
const walkImages = (dir, prefix) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walkImages(p, `${prefix}/${e.name}`);
    else onDisk.push({ url: `${prefix}/${e.name}`, bytes: statSync(p).size });
  }
};
walkImages(join(ROOT, "public", "images"), "/images");
const dead = onDisk.filter((f) => !referenced.has(f.url));

/* ---------- 5. Proposed rename map (NOT applied) ---------- */
const slugOf = (url) => {
  const m = url.match(/\/(Project_Images|projects)\/([^/]+)\//i);
  return m ? m[2].toLowerCase() : "";
};
const subjectOf = (url) => {
  const m = url.match(/\/(Project_Images|projects)\/[^/]+\/([^/]+)\//i);
  return m ? m[2].toLowerCase().replace(/_/g, "-") : "misc";
};
const seen = new Map();
const renames = onDisk
  .filter((f) => referenced.has(f.url) && /Project_Images/i.test(f.url))
  .map((f) => {
    const slug = slugOf(f.url), subject = subjectOf(f.url);
    const key = `${slug}/${subject}`;
    const n = (seen.get(key) ?? 0) + 1;
    seen.set(key, n);
    const ext = extname(f.url).toLowerCase().replace(".jpeg", ".jpg");
    return { from: f.url, to: `/images/projects/${slug}/photos/${slug}-${subject}-${String(n).padStart(2, "0")}${ext}` };
  });

/* ---------- 6. Write the worklist ---------- */
const esc = (s) => s.replace(/\|/g, "\\|");
const md = [];
md.push("# Image audit worklist — punch-list item 12");
md.push("");
md.push(`Generated by \`scripts/image-audit.mjs\`. **Nothing in \`src/\` or \`public/\` was changed.**`);
md.push("");
md.push(`- ${rows.length} alt strings found in \`src/data/*.ts\``);
md.push(`- ${work.length} are project photographs still to do`);
md.push(`- ${rows.filter((r) => r.migrated).length} are already migrated to the §3.1 convention and are excluded`);
md.push(`- ${rows.filter((r) => r.protected).length} are licensed stock in \`home.intro.images\` — **out of scope, do not rewrite** (standing rule in \`site.ts\`)`);
md.push(`- ${rows.filter((r) => !r.onDisk).length} reference a file that is not on disk`);
md.push(`- ${Math.ceil(work.length / PER_SHEET)} contact sheets in \`.image-audit/sheets/\`, ${PER_SHEET} photos each`);
md.push(`- ${dead.length} files under \`public/images\` are referenced by nothing`);
md.push("");
md.push("## How to work this list");
md.push("");
md.push("Read `sheets/sheet-01.png` … in order. Each cell has its **index burned into the top-left corner**; that index is the `#` column below. Write the new alt text into the `New alt` column, then apply them to the `File`/`Line` given. Sheets are ordered worst-first: the photos sharing the most duplicated description come first, so stopping early still fixes the worst of it.");
md.push("");
md.push("Verify the mapping on the first sheet before trusting the rest — confirm cell #1 really is the file named in row 1.");
md.push("");
md.push("| # | Sheet | Cell | Dupes | Current alt | Category | File | Line | Src | New alt |");
md.push("|---|---|---|---|---|---|---|---|---|---|");
for (const r of work) {
  md.push(`| ${r.index} | ${r.sheet} | r${r.row}c${r.col} | ${r.dupes} | ${esc(r.alt)} | ${r.category} | ${r.file} | ${r.line} | \`${r.src}\` | |`);
}
md.push("");
md.push("## Out of scope — licensed stock, leave alone");
md.push("");
md.push("| File | Line | Src | Alt |");
md.push("|---|---|---|---|");
for (const r of rows.filter((x) => x.protected)) {
  md.push(`| ${r.file} | ${r.line} | \`${r.src}\` | ${esc(r.alt)} |`);
}
const missing = rows.filter((r) => !r.onDisk);
if (missing.length) {
  md.push("");
  md.push("## Referenced but missing from disk");
  md.push("");
  md.push("| File | Line | Src |");
  md.push("|---|---|---|");
  for (const r of missing) md.push(`| ${r.file} | ${r.line} | \`${r.src}\` |`);
}

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "WORKLIST.md"), md.join("\n") + "\n");
writeFileSync(
  join(OUT, "worklist.tsv"),
  ["index\tsheet\trow\tcol\tdupes\tfile\tline\tsrc\tcategory\tcurrent_alt\tnew_alt"]
    .concat(work.map((r) => [r.index, r.sheet, r.row, r.col, r.dupes, r.file, r.line, r.src, r.category, r.alt, ""].join("\t")))
    .join("\n") + "\n"
);
writeFileSync(
  join(OUT, "dead-assets.md"),
  ["# Files under public/images that nothing in src/ references", "",
   "Check before deleting: a file may be reached from a place this scan does not read (an email template, a social post, an external link).", "",
   "| File | Size |", "|---|---|"]
    .concat(dead.sort((a, b) => b.bytes - a.bytes).map((f) => `| \`${f.url}\` | ${(f.bytes / 1024).toFixed(0)} KB |`))
    .join("\n") + "\n"
);
writeFileSync(
  join(OUT, "rename-map.tsv"),
  ["# PROPOSED ONLY — nothing has been renamed. Convention:",
   "# /images/projects/<slug>/photos/<slug>-<subject>-<nn>.jpg",
   "# Renaming these changes live URLs. See LAUNCH-PUNCHLIST.md item 12.",
   "from\tto"]
    .concat(renames.map((r) => `${r.from}\t${r.to}`))
    .join("\n") + "\n"
);

console.log(`alt strings:        ${rows.length}`);
console.log(`still to do:        ${work.length}`);
console.log(`already migrated:   ${rows.filter((r) => r.migrated).length}`);
console.log(`protected stock:    ${rows.filter((r) => r.protected).length}`);
console.log(`missing from disk:  ${missing.length}`);
console.log(`thumbnails failed:  ${work.filter((r) => r.thumbFailed).length}`);
console.log(`contact sheets:     ${readdirSync(SHEETS).length}`);
console.log(`dead assets:        ${dead.length}`);
console.log(`proposed renames:   ${renames.length}`);
console.log(`\nwrote .image-audit/{WORKLIST.md,worklist.tsv,dead-assets.md,rename-map.tsv}`);
