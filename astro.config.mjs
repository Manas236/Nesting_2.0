// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

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
  vite: {
    plugins: [tailwindcss()]
  }
});
