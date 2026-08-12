/* ============================================================
   Nesting Tree — master gallery index
   Composes every project's photo set (each project's own
   `gallery` export) with its headline facts from `projects`,
   for the site-wide /gallery page. Ordered the same way the
   projects appear across the site: ongoing first, then delivered.

   Single source of truth: the photos live in each project's data
   file (src/data/<slug>.ts). This file only groups and labels them
   — never hard-code image paths here.
   ============================================================ */
import { projects } from "./site";
import { gallery as shikhar } from "./shikhar";
import { gallery as prithvi } from "./prithvi";
import { gallery as ishaan } from "./ishaan";
// Empty for now — Udaan is in approvals and nothing is built, so the
// project is dropped by the `count > 0` filter below and /gallery skips
// it. Wired up here so it appears the day the first photo lands.
import { gallery as udaan } from "./udaan";
import { gallery as rudra } from "./rudra";
import { gallery as dhruva } from "./dhruva";
import { gallery as shaurya } from "./shaurya";

export type GalleryPhoto = { src: string; alt: string; category: string };

export type ProjectGalleryGroup = {
  slug: string;
  name: string;
  location: string;
  /** Carried through so the /gallery cards read the same as the listing
      cards on / and /projects. Sourced from the project's own data file
      via `projects` — never restated. See the note at the top of site.ts. */
  address: string;
  status: "Ongoing" | "Delivered";
  statusLabel: string;
  count: number;
  cover: string;
  photos: GalleryPhoto[];
};

const photosBySlug: Record<string, GalleryPhoto[]> = {
  shikhar,
  prithvi,
  ishaan,
  udaan,
  rudra,
  dhruva,
  shaurya,
};

// Build one group per project, in the site's canonical project order.
export const galleryGroups: ProjectGalleryGroup[] = projects
  .map((p) => {
    const photos = photosBySlug[p.slug] ?? [];
    return {
      slug: p.slug,
      name: p.name,
      location: p.location,
      address: p.address,
      status: p.status,
      statusLabel: p.statusLabel,
      count: photos.length,
      cover: photos[0]?.src ?? p.image,
      photos,
    };
  })
  .filter((g) => g.count > 0);

export const galleryTotal = galleryGroups.reduce((n, g) => n + g.count, 0);
