import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import pagefind from 'astro-pagefind';

export default defineConfig({
  site: 'https://gaurav-ketkar.github.io',
  output: 'static',
  compressHTML: true,
  integrations: [
    mdx(),
    sitemap(),
    pagefind(),
  ],
  vite: {
    css: {
      postcss: {
        plugins: [tailwindcss(), autoprefixer()],
      },
    },
  },
  markdown: {
    processor: unified(),
    shikiConfig: {
      theme: 'github-dark-dimmed',
    },
  },
});
