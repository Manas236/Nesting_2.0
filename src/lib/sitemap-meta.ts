/* ============================================================
   Per-URL metadata for the sitemap — lastmod, changefreq,
   priority, and image entries.
   ------------------------------------------------------------
   Imported by astro.config.mjs and used from the `serialize` hook
   of @astrojs/sitemap, which is handed one entry at a time and
   returns whatever this file says about it. Nothing here runs at
   request time; it is build-time only.

   WHY A FILE AND NOT A FEW LINES IN THE CONFIG. All four of the
   things below have to be *true*, and the only way to keep them
   true is to derive each one from something that already exists:

     lastmod    — from git, not from file mtime. mtime on the
                  server is the time of the checkout, so mtime
                  would stamp every page "changed today" on every
                  deploy. A sitemap that cries wolf on all 14 URLs
                  every deploy is worse than one with no lastmod at
                  all: the field stops being read.
     images     — from src/data/*.ts, the same arrays the pages
                  render from, so an image can never be listed on
                  a page that does not show it.
     changefreq — a hint only; Google has ignored it since 2023,
                  Bing and Yandex still read it. Kept honest
                  rather than optimistic.
     priority   — relative, within this site only. Also ignored by
                  Google. It says nothing about ranking; it says
                  which of OUR pages matters if a crawler has to
                  choose between them.

   The last two are cheap and harmless. `lastmod` is the one that
   actually does work, and it is the reason this file exists.
   ============================================================ */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

import { featuredSlug, home, homeFeaturedSlugs, projects } from "../data/site";
import { galleryGroups } from "../data/galleries";
import { imageRedirects } from "./image-redirects";

/* `astro build` runs from the project root — the same assumption
   `npm run build` and the postbuild prune already make.
   import.meta.url is NOT usable here: Astro bundles the config and
   everything it imports into a temp file in the project root, so
   this module's own URL is not where its source lives. */
const ROOT = process.cwd();

/* ------------------------------------------------------------------
   lastmod
   ------------------------------------------------------------------ */

/* One `git log` per route, memoised. Fourteen subprocesses at a few ms
   each is nothing against a 5-second build, and doing it per route —
   rather than one walk of the whole history — keeps the mapping from
   file to URL readable. */
const lastmodCache = new Map<string, string | undefined>();
let gitUsable = existsSync(path.join(ROOT, ".git"));

/**
 * Committer date of the most recent commit touching any of `files`, as
 * a W3C datetime. `undefined` when git cannot answer — a missing
 * lastmod is a fact ("we do not know"); a wrong one is a lie.
 *
 * A shallow clone (`git clone --depth 1`) has one commit, so every page
 * would come back with the same date. That is not wrong, just useless;
 * deploys clone normally (DEPLOYMENT.md §5).
 */
function gitLastmod(files: string[]): string | undefined {
  if (!gitUsable) return undefined;

  const key = files.join("\0");
  if (lastmodCache.has(key)) return lastmodCache.get(key);

  let iso: string | undefined;
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", ...files], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    iso = out || undefined;
  } catch {
    /* No git binary, or not a repository. Stop trying — the answer will
       not change between routes within one build. */
    gitUsable = false;
    iso = undefined;
  }

  lastmodCache.set(key, iso);
  return iso;
}

/* ------------------------------------------------------------------
   Images
   ------------------------------------------------------------------ */

export type RouteImage = { url: string; caption?: string };

/* Every path middleware 301s away from. Those files still exist in
   public/ but are DELETED from dist/client by the postbuild prune, so
   listing one would put a URL in the sitemap that answers with a
   redirect. Read from the map itself so the two cannot drift. */
const supersededPaths = new Set(Object.keys(imageRedirects).map((k) => decodeURI(k)));

/* Directories whose contents are never ours to offer up for indexing.
   Matched by prefix, and deliberately NOT the inverse rule (an allowlist
   of /images/projects/): four project photographs still sit on the old
   /images/Project_Images/ path, having missed the August rename, and an
   allowlist would silently drop them — including two that are gallery
   covers. See the note in the handover about finishing that move. */
const EXCLUDED_DIRS = [
  /* LICENSED STOCK of people who are not our residents. Read the note
     above `home.intro` in src/data/site.ts before reversing this. An
     image sitemap is a claim that these are the images of this site,
     and that claim should not be made about a stranger's photograph
     that a thousand other sites also use. */
  "/images/bridge/",
  /* Photographs of named customers, published with their words beside
     them. They agreed to appear on a page, which is not the same as
     being submitted to image search as our inventory. */
  "/images/Testimonials/",
  /* Logo and wordmark. Not photographs of anything. */
  "/images/brand/",
];

/**
 * Photographs and renders of our own buildings, and nothing else.
 *
 * Also excluded:
 *   - .svg — the Udaan placeholder drawing is not a picture of
 *     anything; there is no building to see yet.
 *   - .mp4 / .webm — video wants a video sitemap, not an image one,
 *     and the films here are decorative backdrops.
 *   - superseded originals — see above; pruned from the build.
 *   - anything missing from public/ — the last line of defence
 *     against a sitemap that points at a 404.
 */
function usable(src: string): boolean {
  if (!src.startsWith("/images/")) return false;
  if (EXCLUDED_DIRS.some((dir) => src.startsWith(dir))) return false;
  if (/\.(svg|mp4|webm)$/i.test(src)) return false;
  if (supersededPaths.has(decodeURI(src))) return false;
  return existsSync(path.join(ROOT, "public", decodeURI(src)));
}

/** Filter, de-duplicate (first caption wins), keep source order. */
function imageSet(candidates: RouteImage[]): RouteImage[] {
  const seen = new Set<string>();
  const out: RouteImage[] = [];
  for (const c of candidates) {
    if (!usable(c.url) || seen.has(c.url)) continue;
    seen.add(c.url);
    out.push(c);
  }
  return out;
}

const bySlug = new Map(projects.map((p) => [p.slug, p]));

/** A project's card/hero render, captioned the way its own alt text reads. */
function heroImage(slug: string): RouteImage[] {
  const p = bySlug.get(slug);
  return p ? [{ url: p.image, caption: `${p.name} — ${p.location}` }] : [];
}

/* Caption an image by the project whose render it is. Used where a page
   reaches for an elevation by path rather than by slug — `home.cta.image`
   is Prithvi's today and may be pointed at any building tomorrow, and the
   caption should follow the picture rather than the paragraph beside it. */
function captioned(src: string): RouteImage {
  const p = projects.find((q) => q.image === src);
  return p ? { url: src, caption: `${p.name} — ${p.location}` } : { url: src };
}

/* Full photo sets are attributed to the project pages, not to /gallery,
   even though /gallery carries them all in its DOM for the lightbox. An
   image belongs under the one page that is *about* it; /gallery gets the
   covers and links onward. */
function projectPhotos(slug: string): RouteImage[] {
  const group = galleryGroups.find((g) => g.slug === slug);
  return (group?.photos ?? []).map((ph) => ({ url: ph.src, caption: ph.alt }));
}

/* ------------------------------------------------------------------
   The route table
   ------------------------------------------------------------------ */

type ChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

type RouteMeta = {
  /** Hint only — Google dropped changefreq in 2023; Bing still reads it. */
  changefreq: ChangeFreq;
  /** Relative to the other URLs on THIS site. Not a ranking request. */
  priority: number;
  /** Repo-relative files whose newest commit dates this page. */
  sources: string[];
  images: RouteImage[];
};

/* BaseLayout.astro is deliberately absent from every `sources` list. It
   touches all 14 pages, so including it would move every lastmod
   whenever the header or footer is nudged — chrome changing is not
   content changing, and the field is only worth having if it means one. */
const routes: Record<string, RouteMeta> = {
  "/": {
    changefreq: "weekly",
    priority: 1.0,
    sources: ["src/pages/index.astro", "src/data/site.ts"],
    /* The flagship spread, the two ongoing teasers and the closing CTA
       band — every one of them a project's own elevation render. */
    images: imageSet([
      ...heroImage(featuredSlug),
      ...homeFeaturedSlugs.flatMap((slug) => heroImage(slug)),
      captioned(home.cta.image),
    ]),
  },

  "/projects": {
    changefreq: "weekly",
    priority: 0.9,
    sources: ["src/pages/projects/index.astro", "src/data/site.ts"],
    images: imageSet(projects.flatMap((p) => heroImage(p.slug))),
  },

  "/gallery": {
    changefreq: "monthly",
    priority: 0.7,
    /* Every project's data file: a photo added to any of them changes
       this page. galleries.ts only groups them. */
    sources: [
      "src/pages/gallery.astro",
      "src/data/galleries.ts",
      ...projects.map((p) => `src/data/${p.slug}.ts`),
    ],
    /* Covers only — one photograph per project, carrying its own alt text,
       with the full set attributed to the project page it belongs to. */
    images: imageSet(
      galleryGroups.map((g) => ({
        url: g.cover,
        caption: g.photos.find((ph) => ph.src === g.cover)?.alt ?? `${g.name} — ${g.location}`,
      })),
    ),
  },

  "/contact": {
    changefreq: "monthly",
    /* The conversion page. Second only to the home page in what we would
       want re-crawled first if a crawler had to choose. */
    priority: 0.8,
    sources: ["src/pages/contact.astro", "src/data/contact-page.ts", "src/data/site.ts"],
    images: [],
  },

  "/about": {
    changefreq: "yearly",
    priority: 0.6,
    sources: ["src/pages/about.astro", "src/data/about.ts"],
    images: [],
  },

  /* Real, linked and required — and of no interest to a search engine
     until someone is already looking for them. */
  "/privacy": {
    changefreq: "yearly",
    priority: 0.2,
    sources: ["src/pages/privacy.astro"],
    images: [],
  },
  "/terms": {
    changefreq: "yearly",
    priority: 0.2,
    sources: ["src/pages/terms.astro"],
    images: [],
  },
};

/* One entry per project page, generated rather than listed, so a new
   project is in the sitemap with its photographs the moment it has a
   route and a data file. */
for (const p of projects) {
  routes[`/projects/${p.slug}`] = {
    changefreq: "monthly",
    priority: 0.8,
    sources: [`src/pages/projects/${p.slug}.astro`, `src/data/${p.slug}.ts`],
    images: imageSet([...heroImage(p.slug), ...projectPhotos(p.slug)]),
  };
}

/* ------------------------------------------------------------------
   Public API
   ------------------------------------------------------------------ */

/** `https://nestingtree.in/projects/rudra/` → `/projects/rudra` */
function pathnameOf(url: string): string {
  const p = new URL(url).pathname.replace(/\/+$/, "");
  return p === "" ? "/" : p;
}

export type UrlMeta = {
  lastmod?: string;
  changefreq?: ChangeFreq;
  priority?: number;
  /** Absolute image URLs, resolved against the sitemap's own origin. */
  img?: { url: string; caption?: string }[];
};

/**
 * Everything the sitemap should say about one URL. An unknown URL — a
 * page added without a line in the table above — gets `{}` rather than
 * a guess, so it is still listed, just bare.
 */
export function metaFor(url: string): UrlMeta {
  const meta = routes[pathnameOf(url)];
  if (!meta) return {};

  return {
    lastmod: gitLastmod(meta.sources),
    changefreq: meta.changefreq,
    priority: meta.priority,
    /* Absolute, and resolved against `url` rather than a hard-coded
       origin, so image URLs follow PUBLIC_SITE_URL exactly as <loc> does. */
    img: meta.images.length
      ? meta.images.map((i) => ({ url: new URL(i.url, url).href, caption: i.caption }))
      : undefined,
  };
}
