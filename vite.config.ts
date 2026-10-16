import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	// Os .md da documentação ficam em ../kryncord-lib/docs, fora da raiz do site.
	server: { fs: { allow: ['..'] } }
});
