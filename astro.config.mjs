import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Same domain as the existing site — URLs preserved 1:1 for SEO.
export default defineConfig({
  site: 'https://elad-digital.co.il',
  trailingSlash: 'always',
  build: {
    format: 'directory', // /slug/ -> /slug/index.html, preserving existing URL structure
    inlineStylesheets: 'auto',
  },
  integrations: [
    sitemap({
      i18n: undefined,
      changefreq: 'weekly',
      priority: 0.7,
    }),
  ],
  compressHTML: true,
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
});
