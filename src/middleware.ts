/* ============================================================
   Permanent redirects for renamed image files — IMAGE-SEO-BRIEF.md §3.2.

   Every photograph that gets renamed keeps its old URL alive as a 301,
   indefinitely. A 301 passes ranking signals, so this costs nothing in
   SEO terms; what it buys is that links already shared keep resolving,
   and the Open Graph cards WhatsApp and Facebook have already cached for
   these paths do not turn into broken images.

   Why middleware and not `redirects` in astro.config.mjs: the site
   builds static (`output` is unset), and for static output Astro turns a
   `redirects` entry into an HTML file written at that path. That is the
   right answer for a page and the wrong answer for an image — it would
   put a meta-refresh HTML document at a `.jpeg` URL and answer 200 where
   a 301 is wanted. The brief anticipates this: "or in middleware if the
   map gets long" (§3.2). It will be long — 81 files eventually.

   The map itself is generated; see src/lib/image-redirects.ts.
   ============================================================ */
import type { MiddlewareHandler } from "astro";
import { imageRedirects } from "./lib/image-redirects";

export const onRequest: MiddlewareHandler = (context, next) => {
  const { pathname } = context.url;

  /* Look the path up both as it arrived and decoded. At least one gallery
     entry elsewhere in the repo is URL-encoded (`…%20(1).jpeg`), and a
     browser may send either form. */
  let target = imageRedirects[pathname];
  if (!target) {
    try {
      target = imageRedirects[decodeURIComponent(pathname)];
    } catch {
      /* malformed percent-encoding — not one of ours */
    }
  }

  if (target) return context.redirect(target, 301);
  return next();
};
