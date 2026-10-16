import { redirect } from '@sveltejs/kit';
import { LANGS } from '$lib/i18n';

export function entries() {
	return LANGS.map((lang) => ({ lang }));
}

export function load({ params }) {
	throw redirect(307, `/${params.lang}/docs`);
}
