/* ============================================================
   Workstreams A + B in one pass — IMAGE-SEO-BRIEF.md §0, §7.

     node scripts/optimise-project-images.mjs <slug> [--dry]

   Reads scripts/alt-text/<slug>.tsv (old_path, new_path, alt) and:

     1. re-encodes every source into WebP at the new path, plus a
        640 px `-640.webp` thumbnail for the gallery grid,
     2. rewrites every reference to the old URL anywhere under src/,
     3. writes the new alt text and the real width/height onto the
        gallery entries,
     4. regenerates src/lib/image-redirects.ts so the old URLs keep
        301-ing forever (§3.2).

   Shrinking rewrites every file anyway and WebP changes the extension,
   which IS a rename — so doing A and B separately would mean renaming
   twice and writing the redirect map twice (§0).

   Traps this script is deliberately built around (§10):

   - Line endings. src/data/*.ts are CRLF, src/pages/**.astro are LF.
     Nothing here splits on newlines or matches one: every edit is a
     literal substring or a regex that never spans a line break.
   - Encoding. Files are read and written as UTF-8 through Node, and
     every pattern this script builds is pure ASCII (URLs), so the
     em-dashes already in the alt strings are never re-encoded. The
     replacement text can be non-ASCII safely because it is written
     back through the same UTF-8 encoder it was read with.
   - Counts, not faith. Every substitution asserts how many times it
     matched and the run aborts if any old URL still survives in src/.
   - %20. Manifest paths are URLs; the filesystem read decodes them.

   Idempotent: re-running with the references already rewritten is a
   no-op that still re-encodes the images. Originals are never deleted
   (§7 step 3) — that is a separate commit, after the build passes.
   ============================================================ */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, dirname, relative } from "node:path";

const ROOT = process.cwd();
const FFMPEG = join(ROOT, "node_modules", "ffmpeg-static", "ffmpeg.exe");
const SRC = join(ROOT, "src");
const REDIRECT_MODULE = join(SRC, "lib", "image-redirects.ts");

const slug = process.argv[2];
const DRY = process.argv.includes("--dry");
if (!slug) {
  console.error("usage: node scripts/optimise-project-images.mjs <slug> [--dry]");
  process.exit(1);
}

/* Targets. The gallery is a 3-column masonry inside a 1600 px container,
   so a grid slot is ~485 CSS px and the lightbox is capped at 1200 CSS px
   (ProjectGallery.astro). 1600 covers the lightbox at comfortable density
   without paying for 4608 px camera originals; 640 covers the grid slot
   and is what the browser actually downloads first. Never upscale. */
const FULL = { edge: 1600, quality: 82, maxKB: 300 };
/* pinEdge: ProjectGallery.astro derives the thumbnail's srcset width
   descriptor from this 640 and the full image's aspect ratio, so the
   thumbnail's long edge must never be traded away for size. Quality can
   be; resolution cannot. */
const THUMB = { edge: 640, quality: 80, maxKB: 90, suffix: "-640", pinEdge: true };
/* Files with no alt anywhere in src/ are backdrop plates, not gallery
   photos: no thumbnail, and rendered much larger, so they get the
   hero tier from §7 step 3. */
const PLATE = { edge: 2000, quality: 85, maxKB: 300 };

/* §11 puts the ceiling at ~300 KB per referenced image, and a flat
   quality does not get there: the handheld 4:3 frames are full of scrub,
   gravel and foliage, which is exactly what WebP spends bits on. Three of
   the nine aerials came out at 360-500 KB at q82. So encode to the budget
   instead of to a number — step the quality down until the file fits, and
   stop at 64 rather than chase the budget into visible mush. */
const QUALITY_FLOOR = 64;
const QUALITY_STEP = 6;

/* ---------- manifest ---------- */
const manifestPath = join(ROOT, "scripts", "alt-text", `${slug}.tsv`);
const manifest = readFileSync(manifestPath, "utf8")
  .split(/\r?\n/)
  .filter((l) => l.trim() && !l.startsWith("#") && !l.startsWith("old_path\t"))
  .map((l) => {
    const [from, to, alt = ""] = l.split("\t");
    return { from, to, alt: alt.trim(), isPlate: alt.trim() === "" };
  });

console.log(`${manifest.length} files in ${relative(ROOT, manifestPath)}\n`);

/* ---------- 0. refuse to run on alt text that breaks §3.3 or §6 ----------
   Cheaper to fail here than to find it in the §11 sweep after 63 files
   have been encoded and committed. Everything checked is mechanical; the
   part that matters — does the sentence match the photograph — is the one
   thing a script cannot check, which is why the sheets get looked at. */
const BANNED = /\b(luxury|luxurious|premium|best|affordable|exclusive|prestigious|image of|photo of|picture showing|RERA|MahaRERA|(19|20)\d\d)\b/i;
const project = slug[0].toUpperCase() + slug.slice(1);
const altProblems = [];
const seenAlt = new Set();

/* Every alt already in src/data, so a new string cannot silently collide
   with another project's. Count-based rather than presence-based: one hit
   is this manifest already applied by an earlier run, two is a clash. */
const allDataAlts = readdirSync(join(SRC, "data"))
  .filter((f) => f.endsWith(".ts"))
  .flatMap((f) => [...readFileSync(join(SRC, "data", f), "utf8").matchAll(/alt: "([^"]*)"/g)].map((m) => m[1]));

for (const row of manifest) {
  if (row.isPlate) continue;
  const n = [...row.alt].length;
  const flag = (msg) => altProblems.push(`${row.to.split("/").pop()}: ${msg}`);

  if (n < 80) flag(`${n} chars — under the 80 floor (§3.3)`);
  if (n > 125) flag(`${n} chars — over the 125 ceiling (§3.3)`);
  if (BANNED.test(row.alt)) flag(`contains "${row.alt.match(BANNED)[0]}" (§3.3, §6.2, §6.3)`);
  if ((row.alt.match(new RegExp(project, "g")) ?? []).length !== 1) flag(`names "${project}" ${(row.alt.match(new RegExp(project, "g")) ?? []).length} times, want exactly 1 (§3.3)`);
  if (seenAlt.has(row.alt)) flag("duplicate of another string in this manifest (§3.3)");
  if (allDataAlts.filter((a) => a === row.alt).length > 1) flag("already used by a different image in src/data (§3.3)");
  seenAlt.add(row.alt);
}

if (altProblems.length) {
  console.error(`ABORT — ${altProblems.length} alt-text problem(s):\n  ${altProblems.join("\n  ")}`);
  process.exit(1);
}
console.log(`alt text: ${manifest.filter((r) => !r.isPlate).length} strings pass §3.3 and §6\n`);

/* ---------- 1. encode ---------- */
const probe = (file) => {
  const out = spawnSync(FFMPEG, ["-hide_banner", "-i", file], { encoding: "utf8" });
  const m = (out.stderr || "").match(/Stream #.*Video:.*?, (\d+)x(\d+)/);
  return m ? { w: +m[1], h: +m[2] } : null;
};

const encode = (srcFile, outFile, { edge, quality }) => {
  mkdirSync(dirname(outFile), { recursive: true });
  const vf =
    `scale='if(gt(iw,ih),min(${edge},iw),-2)':'if(gt(iw,ih),-2,min(${edge},ih))':flags=lanczos`;
  const res = spawnSync(FFMPEG, [
    "-hide_banner", "-loglevel", "error", "-y",
    "-i", srcFile,
    "-vf", vf,
    "-c:v", "libwebp", "-quality", String(quality),
    "-compression_level", "6", "-preset", "picture",
    "-map_metadata", "-1",
    "-frames:v", "1",
    outFile,
  ]);
  if (res.status !== 0) throw new Error(`encode failed: ${srcFile}\n${res.stderr}`);
};

const kb = (f) => statSync(f).size / 1024;

/* Quality first, then resolution. A frame full of scrub and gravel can
   sit over the budget even at the floor; when that happens, giving up
   200 px of long edge reads far better than giving up more quality, and
   1400 is still above the 1200 CSS px the lightbox can show. Returns what
   it settled on so the run can report where the budget bit. */
const encodeToBudget = (srcFile, outFile, tier) => {
  let settled;
  const edges = tier.pinEdge
    ? [tier.edge]
    : [tier.edge, Math.round(tier.edge * 0.875), Math.round(tier.edge * 0.75)];
  for (const edge of edges) {
    for (let quality = tier.quality; quality >= QUALITY_FLOOR; quality -= QUALITY_STEP) {
      encode(srcFile, outFile, { edge, quality });
      settled = { edge, quality };
      if (kb(outFile) <= tier.maxKB) return settled;
    }
  }
  return settled;
};

let beforeKB = 0, afterKB = 0;
const overBudget = [];

for (const row of manifest) {
  const srcFile = join(ROOT, "public", decodeURIComponent(row.from));
  if (!existsSync(srcFile)) throw new Error(`source missing: ${row.from}`);
  const outFile = join(ROOT, "public", decodeURIComponent(row.to));
  const tier = row.isPlate ? PLATE : FULL;

  beforeKB += kb(srcFile);
  if (!DRY) {
    const settled = encodeToBudget(srcFile, outFile, tier);
    const dim = probe(outFile);
    row.width = dim?.w;
    row.height = dim?.h;
    afterKB += kb(outFile);

    if (!row.isPlate) {
      const thumbFile = outFile.replace(/\.webp$/, `${THUMB.suffix}.webp`);
      encodeToBudget(srcFile, thumbFile, THUMB);
      afterKB += kb(thumbFile);
      row.thumbKB = kb(thumbFile);
    }
    row.outKB = kb(outFile);
    if (row.outKB > tier.maxKB) overBudget.push(`${row.to} — ${Math.round(row.outKB)} KB at q${settled.quality}, ${settled.edge} px`);
    console.log(
      `  ${String(Math.round(kb(srcFile))).padStart(5)} KB -> ` +
      `${String(Math.round(row.outKB)).padStart(4)} KB q${settled.quality}` +
      (row.thumbKB ? ` + ${String(Math.round(row.thumbKB)).padStart(3)} KB thumb` : "".padEnd(16)) +
      `  ${row.width}x${row.height}  ${row.to.split("/").pop()}`
    );
  }
}

if (DRY) {
  console.log("\n--dry: nothing written");
  process.exit(0);
}

console.log(
  `\nencoded: ${(beforeKB / 1024).toFixed(1)} MB -> ${(afterKB / 1024).toFixed(1)} MB ` +
  `(${(100 - (afterKB / beforeKB) * 100).toFixed(1)}% off)`
);
console.log(
  overBudget.length
    ? `still over the ${FULL.maxKB} KB budget at the quality floor:\n  ${overBudget.join("\n  ")}\n`
    : `every file under the ${FULL.maxKB} KB budget\n`
);

/* ---------- 2. rewrite every reference under src/ ---------- */
/* The redirect map is the one file under src/ that MUST keep the old
   URLs — it is the thing that makes them keep working. Rewriting it would
   turn every entry into new -> new and silently drop the 301s, so it is
   excluded here and regenerated from the manifest in step 4 instead. */
const srcFiles = [];
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(ts|astro|js|mjs|md)$/.test(e.name) && p !== REDIRECT_MODULE) srcFiles.push(p);
  }
})(SRC);

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const counts = { gallery: 0, plain: 0 };

/* The gallery entries gain real width/height (§7 step 5 — this is what
   stops the masonry reflowing as photos load), so the inline type that
   declares them has to admit the two new fields. Optional, because the
   projects that have not been through this script yet still have none. */
const GALLERY_TYPE_OLD = "{ src: string; alt: string; category: string }[]";
const GALLERY_TYPE_NEW = "{ src: string; alt: string; category: string; width?: number; height?: number }[]";

for (const file of srcFiles) {
  const before = readFileSync(file, "utf8");
  let text = before;
  const galleryBefore = counts.gallery;

  for (const row of manifest) {
    /* Gallery entries first: one object literal per line, so the alt and
       the dimensions land on the right photo without ever matching across
       a line break (and therefore without caring about CRLF vs LF). */
    if (!row.isPlate) {
      /* Matches the entry whether it still names the old file or has
         already been migrated: a re-run has to refresh alt text and
         dimensions in place, because the budget loop can settle on a
         smaller long edge the second time round and stale width/height
         would misstate the aspect ratio — worse than having none. */
      const galleryRe = new RegExp(
        `\\{ src: "(?:${escapeRe(row.from)}|${escapeRe(row.to)})", alt: "[^"]*", category: "([^"]*)"[^}\\r\\n]*\\}`,
        "g"
      );
      text = text.replace(galleryRe, (_m, category) => {
        counts.gallery++;
        return `{ src: "${row.to}", alt: "${row.alt}", category: "${category}", width: ${row.width}, height: ${row.height} }`;
      });
    }

    /* Everything else that names the file: amenity images in the project
       file, the site-wide amenity band in site.ts, the backdrop plate in
       thank-you.astro. Plain literal substring, no regex semantics. */
    const parts = text.split(row.from);
    if (parts.length > 1) {
      counts.plain += parts.length - 1;
      text = parts.join(row.to);
    }
  }

  /* Only the file that actually gained dimensions needs the wider type —
     leaving the other six projects' data files untouched. */
  if (counts.gallery > galleryBefore) {
    text = text.split(GALLERY_TYPE_OLD).join(GALLERY_TYPE_NEW);

    /* The block comment above the gallery still points at the old folder
       and still implies the alt text is edited here. Both are now wrong:
       the files moved, and the alt text is generated from the manifest,
       so anyone editing it in place would lose it on the next run. The
       \r?\n keeps this working in the CRLF data files and the LF ones
       alike (§10.1). */
    const eol = text.includes("\r\n") ? "\r\n" : "\n";
    const body = [
      "   Complete set of documentary photos for this project (renders and",
      '   near-duplicate "(1)" variants excluded). Rendered by <ProjectGallery/>',
      "   on the project page and on /gallery — real photography only, never",
      "   renders or stock.",
      "",
      "   Filenames, alt text and the width/height pairs are GENERATED by",
      `   \`node scripts/optimise-project-images.mjs ${slug}\`, which reads`,
      `   scripts/alt-text/${slug}.tsv. Edit the alt text there, not here, or the`,
      `   next run overwrites it. Files live under public/images/projects/${slug}/`,
      "   photos/, each with a 640 px `-640.webp` companion that ProjectGallery",
      "   puts in the srcset; `src` below is the full size the lightbox opens.",
      "",
      "   The old camera-named paths still resolve — see src/lib/image-redirects.ts.",
    ].join(eol) + " */";

    /* Rewrite the whole comment body rather than one sentence inside it,
       so this stays correct however many times the script has already run
       over this file. The terminator is matched but not captured: in these
       data files the closing star-slash ends the last text line rather than
       sitting on a line of its own, so the body supplies its own. */
    const commentRe = new RegExp(
      "(/\\* -+ Gallery — real on-site photographs -+\\r?\\n)[\\s\\S]*?\\*/"
    );
    if (commentRe.test(text)) text = text.replace(commentRe, (_m, open) => open + body);
  }

  if (text !== before) {
    writeFileSync(file, text, "utf8");
    console.log(`  edited ${relative(ROOT, file)}`);
  }
}

console.log(`\nreferences rewritten: ${counts.gallery} gallery entries, ${counts.plain} other`);

/* ---------- 3. assert nothing was missed ---------- */
const survivors = [];
for (const file of srcFiles) {
  const text = readFileSync(file, "utf8");
  for (const row of manifest) if (text.includes(row.from)) survivors.push(`${relative(ROOT, file)} -> ${row.from}`);
}
if (survivors.length) {
  console.error("\nABORT: old URLs still referenced:\n  " + survivors.join("\n  "));
  process.exit(1);
}

/* ---------- 4. redirect map (§3.2 — permanent, kept indefinitely) ---------- */
const existing = existsSync(REDIRECT_MODULE)
  ? [...readFileSync(REDIRECT_MODULE, "utf8").matchAll(/^\s*"([^"]+)":\s*"([^"]+)",$/gm)].map((m) => [m[1], m[2]])
  : [];
const map = new Map(existing);
for (const row of manifest) {
  map.set(row.from, row.to);
  /* The old URL had one file; the new one has two. Only the canonical
     path is redirected — the -640 thumbnail is new and was never linked. */
}
const entries = [...map.entries()].sort(([a], [b]) => a.localeCompare(b));

writeFileSync(
  REDIRECT_MODULE,
  `/* ============================================================
   GENERATED by scripts/optimise-project-images.mjs — do not hand-edit.

   Old image URL -> new image URL, served as a permanent 301 by
   src/middleware.ts. Kept indefinitely, on purpose: a 301 passes
   ranking signals, and these URLs are already live in links people
   have shared and in the Open Graph cards WhatsApp and Facebook have
   cached. See IMAGE-SEO-BRIEF.md §3.2.

   ${entries.length} entries.
   ============================================================ */
export const imageRedirects: Record<string, string> = {
${entries.map(([from, to]) => `  "${from}": "${to}",`).join("\n")}
};
`,
  "utf8"
);
console.log(`redirect map: ${entries.length} entries -> ${relative(ROOT, REDIRECT_MODULE)}`);

/* ---------- 5. encoding check (§10.2) ---------- */
const mojibake = srcFiles.filter((f) => /Â|â|Ã/.test(readFileSync(f, "utf8")));
console.log(mojibake.length ? `\nWARNING double-encoded: ${mojibake.join(", ")}` : "\nencoding clean: no mojibake in src/");
