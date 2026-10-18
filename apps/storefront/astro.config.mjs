import { defineConfig } from 'astro/config';

export default defineConfig({
  // Sitio estático (SSG): máximo rendimiento y SEO.
  output: 'static',
  site: 'https://www.webpro.cat',
  build: {
    inlineStylesheets: 'auto',
  },
});
