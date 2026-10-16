import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';
import { DEFAULT_LANG } from '$lib/i18n';

export function load() {
	throw redirect(307, `${base}/${DEFAULT_LANG}`);
}
