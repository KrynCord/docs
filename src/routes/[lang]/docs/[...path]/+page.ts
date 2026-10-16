import { error } from '@sveltejs/kit';
import { LANGS } from '$lib/i18n';
import { allDocs, getDoc } from '$lib/content';

export function entries() {
	return LANGS.flatMap((lang) =>
		allDocs().map((doc) => ({ lang, path: doc.id }))
	);
}

export function load({ params }) {
	const doc = getDoc(params.path);
	if (!doc) throw error(404, 'Documento não encontrado');
	return { doc, untranslated: params.lang !== 'pt-BR' };
}
