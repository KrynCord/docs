import { redirect } from '@sveltejs/kit';
import { DEFAULT_LANG } from '$lib/i18n';

export function load() {
	throw redirect(307, `/${DEFAULT_LANG}`);
}
