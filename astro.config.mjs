import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://vpickplus.us',
  integrations: [sitemap()],
  // Keep URLs without trailing slashes to match GitHub Pages conventions.
  trailingSlash: 'never',
  build: {
    // Output index.html files for each route so GitHub Pages serves them.
    format: 'directory',
  },
})
