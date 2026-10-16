export const LANGS = ['pt-BR', 'en'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'pt-BR';

type Strings = Record<string, string>;

export const ui: Record<Lang, Strings> = {
	'pt-BR': {
		home: 'Início',
		guides: 'Guias',
		api: 'Componentes',
		internals: 'Internos',
		reference: 'Referência',
		decisions: 'Decisões (ADRs)',
		fallback:
			'Esta página ainda não foi traduzida — o conteúdo abaixo está em português.',
		onThisRepo: 'Repositório',
		version: 'Versão',
		categories: 'Categorias',
		intro:
			'Documentação da KrynCord: guias, arquitetura interna, referência e as decisões que levaram a biblioteca ao formato atual.'
	},
	en: {
		home: 'Home',
		guides: 'Guides',
		api: 'Components',
		internals: 'Internals',
		reference: 'Reference',
		decisions: 'Decisions (ADRs)',
		fallback: 'This page has not been translated yet — the content below is in Portuguese.',
		onThisRepo: 'Repository',
		version: 'Version',
		categories: 'Categories',
		intro:
			'KrynCord documentation: guides, internal architecture, reference and the decisions that shaped the library.'
	}
};

export function isLang(value: string): value is Lang {
	return (LANGS as readonly string[]).includes(value);
}

export function stringsFor(lang: string): Strings {
	return isLang(lang) ? ui[lang] : ui[DEFAULT_LANG];
}
