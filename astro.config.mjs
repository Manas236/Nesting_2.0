// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

// Build-time only: the per-URL lastmod / changefreq / priority / image
// table. Kept out of this file because every value in it is DERIVED —
// lastmod from git, images from src/data/*.ts — and the derivation is
// what needs explaining. See the header of that file.
import { metaFor } from './src/lib/sitemap-meta.ts';

// https://astro.build/config
// The site stays static (all pages are pre-built HTML). The Node adapter is
// added only so that on-demand routes — currently just the /api/contact
// endpoint that writes enquiries to MySQL — can run server-side at request
// time. Pages remain prerendered unless they opt out with `prerender = false`.
export default defineConfig({
  // The public origin. REQUIRED for social sharing: og:image must be an
  // absolute URL or WhatsApp, Facebook and LinkedIn show no preview image at
  // all. Also what canonical URLs and any future sitemap are built from.
  //
  // Set PUBLIC_SITE_URL at BUILD time to override — e.g. while the site is
  // served from a bare EC2 public IP with no domain yet:
  //     PUBLIC_SITE_URL=http://13.234.56.78 npm run build
  // Leave it unset and the production domain is used. Note this is read at
  // build time, not runtime: change it and you must rebuild.
  site: process.env.PUBLIC_SITE_URL || 'https://nestingtree.in',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    // Writes dist/client/sitemap-index.xml + sitemap-0.xml over the
    // prerendered routes. It reads `site` above, so the SAME warning
    // applies: build with PUBLIC_SITE_URL pointing somewhere else and
    // you get a sitemap full of that origin's URLs. Check the file
    // before submitting it to Search Console — a sitemap listing a
    // staging host is a request to index the staging host.
    //
    // /thank-you is excluded. It is `prerender = false` (it reads the
    // ?project / ?status query), so it is not in the crawl the
    // integration walks and the filter is belt-and-braces today — but
    // the day someone prerenders it, the exclusion is already here
    // rather than a thing to remember. It is also disallowed in
    // robots.txt and carries `noindex, follow`.
    sitemap({
      filter: (page) => new URL(page).pathname.replace(/\/$/, '') !== '/thank-you',

      // Each listed URL gets a `lastmod` (the git date of the files that
      // actually produce that page), a `changefreq` and `priority`, and —
      // for the pages that show our own buildings — `<image:image>`
      // entries for every photograph on them. That last part is why the
      // gallery and the seven project pages are worth crawling for Google
      // Images at all: 83 documentary construction photographs, each with
      // written alt text, that are otherwise reachable only through a
      // lightbox.
      //
      // The `img` field is real and supported by the underlying `sitemap`
      // package (the image namespace is emitted by default), but it is
      // missing from @astrojs/sitemap's narrowed `SitemapItem` type — hence
      // the cast. Drop the cast when the integration widens the type; do
      // not drop the field.
      serialize: (item) => /** @type {any} */ ({ ...item, ...metaFor(item.url) }),
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
