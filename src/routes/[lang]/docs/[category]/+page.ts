import { error } from '@sveltejs/kit';
import { LANGS } from '$lib/i18n';
import { categories, docsByCategory } from '$lib/content';

export function entries() {
	return LANGS.flatMap((lang) =>
		categories().map((category) => ({ lang, category: category.key }))
	);
}

export function load({ params }) {
	const docs = docsByCategory(params.category).map((doc) => ({
		id: doc.id,
		title: doc.title
	}));
	if (docs.length === 0) throw error(404, 'Categoria não encontrada');
	return { category: params.category, docs };
}
