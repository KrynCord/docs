<script lang="ts">
	import type { PageProps } from './$types';
	import { page } from '$app/state';
	import { stringsFor } from '$lib/i18n';

	let { data }: PageProps = $props();

	const Doc = $derived(data.doc.component);
	const t = $derived(stringsFor(page.params.lang));
</script>

<svelte:head>
	<title>{data.doc.title} · KrynCord Docs</title>
</svelte:head>

{#if data.untranslated}
	<p class="notice">{t.fallback}</p>
{/if}

<article class="doc">
	<Doc />
</article>

<style>
	.notice {
		border: 1px solid var(--border);
		border-left: 3px solid var(--accent);
		background: var(--bg-soft);
		color: var(--muted);
		border-radius: var(--radius);
		padding: 0.5rem 1rem;
		font-size: 0.92em;
	}

	.doc :global(h1) {
		font-size: 1.9rem;
		line-height: 1.25;
		margin-top: 0;
	}

	.doc :global(h2) {
		border-bottom: 1px solid var(--border);
		padding-bottom: 0.3rem;
		margin-top: 2rem;
	}

	.doc :global(h3) {
		margin-top: 1.5rem;
	}

	.doc :global(li) {
		margin: 0.25rem 0;
	}
</style>
