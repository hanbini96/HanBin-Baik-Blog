import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// Astro configuration for a static site hosted on GitHub Pages with the
// custom domain https://hanbinbaik.dev (served from the domain root, so no `base`).
export default defineConfig({
  site: 'https://hanbinbaik.dev',
  output: 'static',
  markdown: {
    shikiConfig: {
      theme: 'github-dark'
    }
  },
  integrations: [react(), tailwind()],
  vite: {
    build: {
      rollupOptions: {
        onwarn: (warning, defaultHandler) => {
          // Suppress marked.js deprecation warnings
          if (warning.code === 'PLUGIN_WARNING' && warning.message.includes('marked()')) {
            return;
          }
          defaultHandler(warning);
        }
      }
    }
  }
});