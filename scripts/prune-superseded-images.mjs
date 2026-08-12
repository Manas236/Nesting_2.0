/* ============================================================
   Post-build prune of superseded image originals.

   WHY THIS EXISTS
   ---------------
   80 photographs were renamed. Their old URLs are kept alive as 301s by
   src/middleware.ts, driven by the map in src/lib/image-redirects.ts.

   But middleware only runs inside the Astro node process, and nginx serves
   /images/ from disk (see deploy/nginx-*.conf). `public/` is copied into
   `dist/client` wholesale, so the superseded originals ship too — and an old
   URL therefore finds the original on disk and answers 200 with a multi-megabyte
   JPEG. The middleware never runs, the 301 never fires, and Google sees two
   URLs for one photograph.

   So the build deletes those originals from `dist/client`. Combined with
   `try_files $uri @node;` on the /images/ location in both nginx configs, an
   old URL now misses on disk, falls through to node, and gets its 301.

   Neither half works alone: prune without the nginx fallback turns old URLs
   into 404s; the fallback without the prune never fires.

   WHAT IT DELETES
   ---------------
   Exactly the paths that are KEYS in src/lib/image-redirects.ts, and only from
   `dist/client` — never from `public/`, which holds the only full-resolution
   copies. The list is read from that file at run time rather than restated
   here, so the two cannot drift apart.

   Keys are URLs, so a few are percent-encoded (`…%20(1).jpeg`) where the file
   on disk has a literal space. They are decoded before touching the filesystem.

   Runs automatically as npm's `postbuild`, i.e. on every `npm run build`.
   (Calling `astro build` directly skips it — deploys use `npm run build`; see
   DEPLOYMENT.md §5.)
   ============================================================ */
import { readFile, rm, readdir, rmdir, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mapFile = path.join(root, "src", "lib", "image-redirects.ts");
const clientDir = path.join(root, "dist", "client");
/* Directory pruning stops here, so an emptied tree never eats dist/client. */
const imagesDir = path.join(clientDir, "images");

const exists = (p) =>
  access(p).then(
    () => true,
    () => false,
  );

/* Read the generated map without needing a TypeScript loader: the file is a
   single `export const` with one type annotation, so strip the annotation and
   import the result as a module. If the generator ever changes that shape the
   import throws and the build fails loudly, which is the wanted behaviour —
   silently pruning nothing is how the originals would creep back into a
   deploy. */
async function loadRedirects() {
  const src = await readFile(mapFile, "utf8");
  const js = src.replace(": Record<string, string> =", " =");
  const mod = await import(
    "data:text/javascript;base64," + Buffer.from(js, "utf8").toString("base64")
  );
  const map = mod.imageRedirects;
  if (!map || typeof map !== "object" || Object.keys(map).length === 0) {
    throw new Error(`no redirects found in ${path.relative(root, mapFile)}`);
  }
  return map;
}

/* URL path -> absolute path inside dist/client, refusing anything that escapes
   it or that is not under /images/. */
function resolveInClient(urlPath) {
  if (!urlPath.startsWith("/images/")) {
    throw new Error(`redirect key is not under /images/: ${urlPath}`);
  }
  const decoded = decodeURIComponent(urlPath);
  const abs = path.resolve(clientDir, "." + decoded);
  if (abs !== imagesDir && !abs.startsWith(imagesDir + path.sep)) {
    throw new Error(`redirect key resolves outside dist/client/images: ${urlPath}`);
  }
  return abs;
}

/* Remove directories that the prune emptied, walking up until one still has
   contents. Several of these folders keep files that are not in the map, so
   this is opportunistic, not a given. */
async function pruneEmptyDirs(startDirs) {
  let removed = 0;
  const queue = [...startDirs].sort((a, b) => b.length - a.length);
  for (const dir of queue) {
    let cur = dir;
    while (cur.startsWith(imagesDir + path.sep)) {
      let entries;
      try {
        entries = await readdir(cur);
      } catch {
        break; // already gone, via a deeper pass
      }
      if (entries.length > 0) break;
      await rmdir(cur);
      removed += 1;
      cur = path.dirname(cur);
    }
  }
  return removed;
}

async function main() {
  if (!(await exists(clientDir))) {
    throw new Error(`no build output at ${path.relative(root, clientDir)} — run astro build first`);
  }

  const redirects = await loadRedirects();
  const keys = Object.keys(redirects);

  /* Pre-flight: every redirect TARGET must be present in the build before any
     original is deleted. If a replacement is missing, deleting the original
     would take the photograph off the site rather than redirect it. */
  const missingTargets = [];
  for (const target of Object.values(redirects)) {
    if (!(await exists(resolveInClient(target)))) missingTargets.push(target);
  }
  if (missingTargets.length > 0) {
    throw new Error(
      `${missingTargets.length} redirect target(s) missing from the build — refusing to prune:\n  ` +
        missingTargets.join("\n  "),
    );
  }

  let deleted = 0;
  let alreadyAbsent = 0;
  const touchedDirs = new Set();
  for (const key of keys) {
    const abs = resolveInClient(key);
    if (await exists(abs)) {
      await rm(abs);
      deleted += 1;
      touchedDirs.add(path.dirname(abs));
    } else {
      alreadyAbsent += 1;
    }
  }

  const dirsRemoved = await pruneEmptyDirs(touchedDirs);

  console.log(
    `prune-superseded-images: ${keys.length} redirect keys, ` +
      `${deleted} originals deleted from dist/client` +
      (alreadyAbsent > 0 ? `, ${alreadyAbsent} already absent` : "") +
      `, ${keys.length} replacements verified present` +
      (dirsRemoved > 0 ? `, ${dirsRemoved} emptied director${dirsRemoved === 1 ? "y" : "ies"} removed` : "") +
      ".",
  );
}

main().catch((err) => {
  console.error(`prune-superseded-images: ${err.message}`);
  process.exit(1);
});
