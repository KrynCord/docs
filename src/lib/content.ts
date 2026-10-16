import type { Component } from 'svelte';

type Module = { default: Component };

/**
 * Os `.md` são lidos direto do repositório da biblioteca
 * (`../kryncord-lib/docs`) — uma única fonte de verdade. O README do PyPI e o
 * do GitHub apontam para os mesmos arquivos, então o site nunca fica
 * defasado do repo.
 *
 * O `!` exclui o arquivo do próprio bundle (o Vite exige padrão literal, por
 * isso está escrito por extenso) — ver EXCLUDE abaixo.
 */
const modules = import.meta.glob<Module>(
	[
		'../../../kryncord-lib/docs/**/*.md',
		'!../../../kryncord-lib/docs/reference/ideiabase.md'
	],
	{ eager: true }
);

const raws = import.meta.glob<string>(
	[
		'../../../kryncord-lib/docs/**/*.md',
		'!../../../kryncord-lib/docs/reference/ideiabase.md'
	],
	{
		eager: true,
		query: '?raw',
		import: 'default'
	}
);

export type Doc = {
	id: string;
	category: string;
	title: string;
	order: number;
	component: Component;
};

export type Category = { key: string; labelKey: string };

export const CATEGORY_ORDER = [
	'guides',
	'api',
	'internals',
	'reference',
	'decisions'
] as const;

function toId(path: string): string {
	return path
		.replace(/^(\.\.\/)+kryncord-lib\/docs\//, '')
		.replace(/\.md$/, '')
		.replace(/\\/g, '/');
}

function titleOf(raw: string, id: string): string {
	const heading = raw.match(/^#\s+(.+)$/m);
	if (heading) return heading[1].replace(/\*\*/g, '').trim();
	const last = id.split('/').pop() ?? id;
	return last.replace(/^\d+-/, '').replace(/-/g, ' ');
}

function orderOf(id: string): number {
	const name = id.split('/').pop() ?? id;
	const match = name.match(/^(\d+)/);
	return match ? Number(match[1]) : 9999;
}

function categoryRank(key: string): number {
	const index = (CATEGORY_ORDER as readonly string[]).indexOf(key);
	return index === -1 ? CATEGORY_ORDER.length : index;
}

/**
 * Arquivos que ainda não renderizam no site.
 *
 * `reference/ideiabase.md` é o rascunho de design da própria documentação:
 * usa marcação `<Callout>`/`<Tabs>` que o site ainda não implementa. O
 * arquivo continua no repo, legível pelo GitHub; quando os componentes
 * existirem aqui, tire daqui E do `!` nos globs acima.
 */
const EXCLUDE = new Set(['reference/ideiabase.md']);

const docs: Doc[] = Object.keys(modules)
	// O README.md da raiz do docs é o índice para o GitHub, não uma página.
	.filter((path) => !/docs\/[^/]+\.md$/.test(path))
	.map((path) => {
		const id = toId(path);
		const [category] = id.split('/');
		return {
			id,
			category,
			title: titleOf(raws[path] ?? '', id),
			order: orderOf(id),
			component: modules[path].default
		};
	})
	.filter((doc) => !EXCLUDE.has(doc.id))
	.sort(
		(a, b) =>
			categoryRank(a.category) - categoryRank(b.category) ||
			a.order - b.order ||
			a.id.localeCompare(b.id)
	);

export function allDocs(): Doc[] {
	return docs;
}

export function categories(): Category[] {
	const present = new Set(docs.map((doc) => doc.category));
	const ordered = (CATEGORY_ORDER as readonly string[]).filter((key) => present.has(key));
	const extras = [...present].filter((key) => !ordered.includes(key)).sort();
	return [...ordered, ...extras].map((key) => ({ key, labelKey: key }));
}

export function docsByCategory(category: string): Doc[] {
	return docs.filter((doc) => doc.category === category);
}

export function getDoc(id: string): Doc | undefined {
	return docs.find((doc) => doc.id === id);
}
