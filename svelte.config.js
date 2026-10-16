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
		prerender: {
			// Âncora órfã (link para seção inexistente) não derruba o build.
			handleMissingId: 'warn'
		}
	}
};

export default config;
