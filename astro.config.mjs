// @ts-check
import { defineConfig } from 'astro/config';

// Pour GitHub Pages :
// - si ton dépôt s'appelle "<ton-pseudo>.github.io" → site: 'https://<ton-pseudo>.github.io', base: '/'
// - sinon (ex. dépôt "portfolio")                  → site: 'https://<ton-pseudo>.github.io', base: '/portfolio'
export default defineConfig({
  site: 'https://abibatouwandaogo.github.io',
  base: '/portfolio',
});
