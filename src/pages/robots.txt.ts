/* ============================================================
   GET /robots.txt
   ------------------------------------------------------------
   Generated, not a static file in public/. The only line in it
   that matters is `Sitemap:`, and that line has to be an ABSOLUTE
   URL at the origin the build was actually made for — a sitemap
   announced at https://nestingtree.in from a build served on a
   bare IP points crawlers at a host that does not answer.

   `astro.config.mjs` already lets PUBLIC_SITE_URL move the origin
   at build time (it is the documented path for serving from an EC2
   public IP before DNS exists), and canonical + og:image are both
   derived from `Astro.site` for exactly this reason. Hard-coding
   the origin here would be the one absolute URL on the site that
   does not follow it.

   Prerendered, so this lands in the build output as a plain file at
   dist/client/robots.txt and nginx serves it from disk.
   ============================================================ */
import type { APIRoute } from "astro";

export const prerender = true;

/* /thank-you is the form-confirmation page. It is disallowed here and
   carries `noindex, follow` in its own markup — see src/pages/thank-you.astro.
   Both, deliberately: robots.txt stops the crawl, the meta tag is what
   actually keeps it out of the index if it is reached by a link. */
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL("/sitemap-index.xml", site).href;

  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /thank-you",
    "",
    `Sitemap: ${sitemap}`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
