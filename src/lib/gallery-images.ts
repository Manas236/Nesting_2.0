/* ============================================================
   Responsive sources for gallery photographs — IMAGE-SEO-BRIEF.md §7
   step 5.

   Two different components render the same photographs: the masonry on
   each project page (ProjectGallery.astro) and the five-tile preview
   mosaic on /gallery. Both need the same srcset and both derive it the
   same way, so the convention lives here once rather than being written
   out — and drifting — in two places.

   The convention: `scripts/optimise-project-images.mjs` writes each
   photo twice, as `<name>.webp` at up to 1600 px on the long edge and
   `<name>-640.webp` at 640 px. Only the full-size path is stored in
   src/data/*.ts; the thumbnail is found by suffix, and its width
   descriptor is computed from the full image's aspect ratio.

   A project that has not been through that script yet has no width or
   height on its items. That is the migration marker: those items get a
   plain `src` and no srcset, and render exactly as they did before.
   ============================================================ */

export interface GalleryItem {
  src: string;
  alt: string;
  category?: string;
  width?: number;
  height?: number;
}

/* Must match THUMB.edge in scripts/optimise-project-images.mjs, which
   pins it for exactly this reason: the thumbnail is the long edge scaled
   to 640, so its width descriptor is derivable and never has to be
   carried in the data. */
export const THUMB_EDGE = 640;

export interface ImageSources {
  src: string;
  srcset?: string;
  sizes?: string;
  width?: number;
  height?: number;
}

export function galleryImage(item: GalleryItem, sizes: string): ImageSources {
  if (!item.width || !item.height) return { src: item.src };

  const thumb = item.src.replace(/\.webp$/, `-${THUMB_EDGE}.webp`);
  const thumbWidth = Math.round((item.width * THUMB_EDGE) / Math.max(item.width, item.height));

  return {
    src: thumb,
    srcset: `${thumb} ${thumbWidth}w, ${item.src} ${item.width}w`,
    sizes,
    width: item.width,
    height: item.height,
  };
}
