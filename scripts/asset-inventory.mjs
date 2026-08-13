/* ============================================================
   Which files under public/ does the site actually use?

     node scripts/asset-inventory.mjs            # write ASSET-INVENTORY.md
     node scripts/asset-inventory.mjs --prune    # ...and delete the orphans

   Writes ASSET-INVENTORY.md at the repo root and nothing else. Without
   --prune it deletes nothing; with it, it deletes ONLY files in the
   "orphan" class below, and only under public/images/.

   ------------------------------------------------------------
   How a file is judged. Three classes, and the middle one is the one
   that catches people out:

   USED       Named in src/, or present in the built HTML. Never deleted.
   SUPERSEDED A key in src/lib/image-redirects.ts — the full-resolution
              original of a photo that now ships as WebP. Nothing links
              to it, but it is NOT rubbish: it is the only full-size copy
              outside git, and src/middleware.ts still 301s its URL.
              scripts/prune-superseded-images.mjs already keeps it out of
              dist/, so it costs nothing to keep. NEVER deleted here.
   ORPHAN     Neither. Nothing references it, no redirect mentions it, and
              it is not the original of anything. This is the delete list.

   ------------------------------------------------------------
   Why the built HTML is read as well as src/:

   src/ is the source of truth for asset paths, but reading only src/
   would miss anything a template composes at build time (a path built
   from a slug, an og: card picked by BaseLayout). Reading only the build
   would miss anything behind a feature flag that is currently off —
   `features.areaStats` is false today, and the day it is true its images
   must not have been deleted. Both are read, and the union is "used".

   Run `npm run build` first, or the second half is stale.

   ------------------------------------------------------------
   Checked 13 Aug 2026 and worth re-checking if the editor grows: image
   paths CANNOT come from the database. content_edits stores original_text
   / new_text only and src/scripts/inline-edit.js applies them through
   `textContent`, so no image path can reach a page from anywhere but
   src/. If that ever changes, this script's answer stops being complete.
   ============================================================ */
import { readFileSync, writeFileSync, readdirSync, statSync, unlinkSync, rmdirSync, existsSync } from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = process.cwd();
const PRUNE = process.argv.includes("--prune");
const ASSET_RE = /\.(jpe?g|png|webp|gif|avif|svg|mp4|webm|mov|ico)$/i;

/* ---------- every file under public/ ---------- */
const publicFiles = [];
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else publicFiles.push("/" + path.relative("public", p).replace(/\\/g, "/"));
  }
})("public");

/* ---------- what src/ and the build name ---------- */
const used = new Set();
const norm = (u) => {
  try { u = decodeURIComponent(u); } catch { /* leave as-is */ }
  return u.split("?")[0].split("#")[0].toLowerCase();
};

function scan(dir, exts) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { scan(p, exts); continue; }
    if (!exts.test(e.name)) continue;
    // The redirect map names every superseded original on its left-hand side.
    // Scanning it here would mark all 103 of them "used" by their own
    // gravestone. It is read deliberately, further down.
    if (p.replace(/\\/g, "/").endsWith("src/lib/image-redirects.ts")) continue;
    const text = readFileSync(p, "utf8");
    // any /-rooted path ending in an asset extension, however it is quoted
    for (const m of text.matchAll(/["'`(]\s*(\/[^"'`)\s]+?\.(?:jpe?g|png|webp|gif|avif|svg|mp4|webm|mov|ico))/gi)) {
      used.add(norm(m[1]));
    }
  }
}
scan("src", /\.(astro|ts|js|mjs|css)$/);
if (existsSync("dist/client")) scan("dist/client", /\.(html|css|js)$/);
else console.warn("! dist/client is missing — run `npm run build` first, or this is source-only");

/* ---------- superseded originals: never delete ---------- */
const superseded = new Set();
{
  const src = readFileSync("src/lib/image-redirects.ts", "utf8");
  for (const m of src.matchAll(/"([^"]+)":\s*"([^"]+)"/g)) {
    superseded.add(norm(m[1]));
    used.add(norm(m[2]));           // the replacement is used by definition
  }
}

/* ---------- classify ---------- */
const rows = publicFiles.map((f) => {
  const k = norm(f);
  const cls = used.has(k) ? "used" : superseded.has(k) ? "superseded" : "orphan";
  return { file: f, bytes: statSync(path.join("public", decodeURIComponent(f))).size, cls };
});

const orphans = rows.filter((r) => r.cls === "orphan");

/* Deleting is only ever safe because git still has the file. An UNTRACKED
   orphan is unrecoverable, and it is usually not rubbish at all — it is a
   file someone has just dropped into public/ and not yet wired up. Those are
   reported and never deleted. (This is not hypothetical: a new hero video was
   sitting in public/images/projects/ unreferenced within an hour of this
   script being written.) */
const tracked = new Set(
  execSync("git ls-files public", { encoding: "utf8", maxBuffer: 1 << 28 })
    .split("\n").filter(Boolean).map((p) => norm(p.replace(/^public/, "")))
);
const isTracked = (r) => tracked.has(norm(r.file));

// Only ever prune media under /images/. Everything else — favicons, the
// content .docx, anything a human put there on purpose — is reported, never touched.
const prunable = orphans.filter(
  (r) => r.file.startsWith("/images/") && ASSET_RE.test(r.file) && isTracked(r)
);
const untrackedOrphans = orphans.filter(
  (r) => r.file.startsWith("/images/") && ASSET_RE.test(r.file) && !isTracked(r)
);
const keptOrphans = orphans.filter((r) => !prunable.includes(r) && !untrackedOrphans.includes(r));

const mb = (n) => (n / 1048576).toFixed(1);
const sum = (a) => a.reduce((t, r) => t + r.bytes, 0);

if (PRUNE) {
  for (const r of prunable) unlinkSync(path.join("public", decodeURIComponent(r.file)));
  // clear directories the deletions emptied
  let removed;
  do {
    removed = 0;
    (function sweep(dir) {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        if (!e.isDirectory()) continue;
        const p = path.join(dir, e.name);
        sweep(p);
        if (readdirSync(p).length === 0) { rmdirSync(p); removed++; }
      }
    })("public");
  } while (removed);
  console.log(`pruned ${prunable.length} files, ${mb(sum(prunable))} MB`);
}

/* ---------- the report ---------- */
const byDir = new Map();
for (const r of rows.filter((x) => x.cls === "used")) {
  const d = path.posix.dirname(r.file);
  if (!byDir.has(d)) byDir.set(d, []);
  byDir.get(d).push(r);
}

const stamp = new Date().toISOString().slice(0, 10);
const usedRows = rows.filter((r) => r.cls === "used");
const supRows = rows.filter((r) => r.cls === "superseded");
const left = PRUNE ? [] : prunable;

const md = `# Asset inventory — every image and video the site uses

**Generated ${stamp} by \`node scripts/asset-inventory.mjs\`. Do not hand-edit —
re-run it instead.** Run \`npm run build\` first: the script reads the built HTML
as well as \`src/\`, and a stale build gives a stale answer.

| | Files | Size |
|---|---|---|
| **Used** — referenced from \`src/\` or present in the build | ${usedRows.length} | ${mb(sum(usedRows))} MB |
| **Superseded originals** — full-res masters behind a 301, pruned from \`dist/\` | ${supRows.length} | ${mb(sum(supRows))} MB |
| **Orphans** — referenced by nothing${PRUNE ? ", deleted this run" : ""} | ${left.length} | ${mb(sum(left))} MB |
| Other files left alone (favicons, documents) | ${keptOrphans.length} | ${mb(sum(keptOrphans))} MB |

## How to read this

- **Used** is the safe list. Deleting anything here breaks a page.
- **Superseded** is not rubbish. Each is the only full-resolution copy of a
  photograph outside git, its URL still 301s via \`src/middleware.ts\`, and
  \`scripts/prune-superseded-images.mjs\` already keeps it out of the deploy. It
  costs nothing to keep and cannot be regenerated from the WebP.
- Image paths **cannot** come from the database — \`content_edits\` stores text
  only. \`src/\` plus the build is therefore the complete picture. Re-check that
  if the in-page editor ever learns to change an image.

## Used assets, by folder

${[...byDir.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([d, list]) => {
  const total = mb(sum(list));
  return `### \`${d}/\` — ${list.length} file${list.length === 1 ? "" : "s"}, ${total} MB\n\n` +
    "| File | Size |\n|---|---|\n" +
    list.sort((a, b) => b.bytes - a.bytes)
      .map((r) => `| \`${path.posix.basename(r.file)}\` | ${(r.bytes / 1024).toFixed(0)} KB |`).join("\n");
}).join("\n\n")}

${left.length ? `## Orphans still on disk\n\nNothing references these. \`node scripts/asset-inventory.mjs --prune\` deletes them.\n\n| File | Size |\n|---|---|\n${left.sort((a, b) => b.bytes - a.bytes).map((r) => `| \`${r.file}\` | ${(r.bytes / 1024).toFixed(0)} KB |`).join("\n")}\n` : "## Orphans\n\nNone — every file under `public/images/` is either used or a superseded original.\n"}
${untrackedOrphans.length ? `## ⚠ Unreferenced, but NOT in git — never auto-deleted

Nothing references these, but git has no copy, so deleting one is permanent.
Usually that means a file was added recently and has not been wired up yet.
**Wire it up, commit it, or delete it by hand — the script will not touch it.**

| File | Size |
|---|---|
${untrackedOrphans.sort((a, b) => b.bytes - a.bytes).map((r) => `| \`${r.file}\` | ${(r.bytes / 1024).toFixed(0)} KB |`).join("\n")}
` : ""}
${keptOrphans.length ? `## Left alone deliberately\n\nUnreferenced, but not media under \`/images/\` — the script never deletes these.\n\n| File | Size |\n|---|---|\n${keptOrphans.sort((a, b) => b.bytes - a.bytes).map((r) => `| \`${r.file}\` | ${(r.bytes / 1024).toFixed(0)} KB |`).join("\n")}\n` : ""}`;

writeFileSync("ASSET-INVENTORY.md", md);
console.log(`used ${usedRows.length} (${mb(sum(usedRows))} MB) · superseded ${supRows.length} (${mb(sum(supRows))} MB) · ` +
  `${PRUNE ? "pruned" : "orphan"} ${prunable.length} (${mb(sum(prunable))} MB) · other ${keptOrphans.length}`);
if (!PRUNE && prunable.length) console.log("re-run with --prune to delete the orphans");
