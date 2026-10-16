<script lang="ts">
	import type { PageProps } from './$types';
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { stringsFor } from '$lib/i18n';
	import { categories, docsByCategory } from '$lib/content';

	let { data }: PageProps = $props();

	const t = $derived(stringsFor(page.params.lang));
	const root = $derived(`${base}/${page.params.lang}/docs`);
</script>

<svelte:head>
	<title>KrynCord Docs</title>
</svelte:head>

<h1>KrynCord Docs</h1>
<p class="lead">{t.intro}</p>

{#each categories() as cat (cat.key)}
	<section class="card">
		<h2><a href={`${root}/${cat.key}`}>{t[cat.labelKey] ?? cat.key}</a></h2>
		<ul class="plain">
			{#each docsByCategory(cat.key) as doc (doc.id)}
				<li><a href={`${root}/${doc.id}`}>{doc.title}</a></li>
			{/each}
		</ul>
	</section>
{/each}

<style>
	.lead {
		color: var(--muted);
		max-width: 60ch;
	}
	.card {
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 0.5rem 1.25rem 1rem;
		margin: 1rem 0;
		background: var(--bg-soft);
	}
	.card h2 {
		font-size: 1.05rem;
		margin: 0.75rem 0 0.5rem;
	}
	.plain {
		margin: 0;
		padding-left: 1.1rem;
	}
	.plain li {
		margin: 0.25rem 0;
	}
</style>
