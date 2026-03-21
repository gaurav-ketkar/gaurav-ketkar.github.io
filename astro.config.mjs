import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import pagefind from 'astro-pagefind';

export default defineConfig({
  site: 'https://gaurav-ketkar.github.io',
  integrations: [
    tailwind(),
    mdx(),
    sitemap(),
    pagefind(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
    },
  },
});
