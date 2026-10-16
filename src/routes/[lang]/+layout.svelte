<script lang="ts">
	import type { LayoutProps } from './$types';
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { LANGS, stringsFor, type Lang } from '$lib/i18n';
	import { CURRENT_VERSION } from '$lib/versions';
	import { categories, docsByCategory } from '$lib/content';

	let { children }: LayoutProps = $props();

	const lang = $derived((page.params.lang ?? 'pt-BR') as Lang);
	const t = $derived(stringsFor(lang));
	const root = $derived(`${base}/${lang}/docs`);
	// O pathname pode incluir o base do deploy (/docs); a parte que interessa
	// começa depois de /{lang}.
	const rest = $derived(
		page.url.pathname.slice(page.url.pathname.indexOf(`/${lang}`) + lang.length + 1)
	);
	const homeActive = $derived(
		page.url.pathname === root || page.url.pathname === `${root}/`
	);
</script>

<div class="shell">
	<header class="topbar">
		<a class="brand" href={root}>
			<span class="brand-name">KrynCord</span>
			<span class="brand-sub">Docs</span>
		</a>
		<span class="badge">v{CURRENT_VERSION} beta</span>
		<nav class="langs" aria-label="Idioma">
			{#each LANGS as l (l)}
				<a href={`${base}/${l}${rest}`} class:active={l === lang}>{l}</a>
			{/each}
		</nav>
		<a class="gh" href="https://github.com/KrynCord/kryncord">GitHub</a>
	</header>

	<div class="body">
		<aside class="sidebar">
			<a href={root} class="home" class:active={homeActive}>{t.home}</a>

			{#each categories() as cat (cat.key)}
				<section class="group">
					<h2>{t[cat.labelKey] ?? cat.key}</h2>
					<ul>
						{#each docsByCategory(cat.key) as doc (doc.id)}
							<li>
								<a
									href={`${root}/${doc.id}`}
									class:active={page.url.pathname === `${root}/${doc.id}`}
								>
									{doc.title}
								</a>
							</li>
						{/each}
					</ul>
				</section>
			{/each}
		</aside>

		<main class="content">
			{@render children()}
		</main>
	</div>
</div>
