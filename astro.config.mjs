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
  adapter: node({ mode: 'standalone' }),
  vite: {
    plugins: [tailwindcss()]
  }
});
