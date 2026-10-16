<script lang="ts">
	import type { PageProps } from './$types';
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { stringsFor } from '$lib/i18n';

	let { data }: PageProps = $props();

	const t = $derived(stringsFor(page.params.lang));
	const root = $derived(`${base}/${page.params.lang}/docs`);
</script>

<svelte:head>
	<title>{t[data.category] ?? data.category} · KrynCord Docs</title>
</svelte:head>

<h1>{t[data.category] ?? data.category}</h1>

<ul class="plain">
	{#each data.docs as doc (doc.id)}
		<li><a href={`${root}/${doc.id}`}>{doc.title}</a></li>
	{/each}
</ul>

<style>
	.plain {
		padding-left: 1.1rem;
	}
	.plain li {
		margin: 0.35rem 0;
	}
</style>
