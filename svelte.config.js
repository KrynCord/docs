import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { mdsvexOptions } from './mdsvex.config.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
	kit: {
		adapter: adapter({ pages: 'build', assets: 'build', strict: true }),
		paths: {
			// O GitHub Pages serve projetos em /docs/; localmente fica vazio.
			// O deploy define BASE_PATH=/docs (ver .github/workflows/deploy.yml).
			base: process.env.BASE_PATH ?? ''
		},
		prerender: {
			// Âncora órfã (link para seção inexistente) não derruba o build.
			handleMissingId: 'warn'
		}
	}
};

export default config;
