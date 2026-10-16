import path from 'node:path';

const GITHUB = 'https://github.com/KrynCord/kryncord/blob/main';

/**
 * Os `.md` vivem no repo da lib (`../kryncord-docs/../kryncord-lib/docs`) e são
 * linkados entre si com caminhos relativos no estilo GitHub
 * (`../guides/publication.md`). No site o caminho da URL espelha o do arquivo,
 * então basta remover o `.md` para o link continuar relativo — assim ele
 * preserva o idioma (`/pt-BR/docs/...` ou `/en/docs/...`). Link que sai da
 * pasta `docs/` vira URL absoluta do GitHub, porque o site não serve esses
 * arquivos.
 */
function fixUrl(url, fileDir) {
	if (/^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith('#')) return url;

	const hashAt = url.indexOf('#');
	const target = hashAt === -1 ? url : url.slice(0, hashAt);
	const hash = hashAt === -1 ? '' : url.slice(hashAt);

	if (!/\.md$/i.test(target)) return url;

	const absolute = path.posix.normalize(path.posix.join(fileDir || '.', target));

	if (absolute.startsWith('..')) {
		const githubPath = path.posix.normalize(path.posix.join('docs', absolute)).replace(/^\.\//, '');
		return `${GITHUB}/${githubPath}${hash}`;
	}

	return target.replace(/\.md$/i, '') + hash;
}

function rewriteMdLinks() {
	return (_tree, file) => {
		const filePath = String(file?.path ?? file?.history?.[0] ?? '').replace(/\\/g, '/');
		const match = filePath.match(/^(?:.*\/)?kryncord-lib\/docs\/(.*)$/);
		const fileDir = match ? path.posix.dirname(match[1]) : '';

		const walk = (node) => {
			if (node.type === 'link' && typeof node.url === 'string') {
				node.url = fixUrl(node.url, fileDir);
			}
			if (Array.isArray(node.children)) node.children.forEach(walk);
		};

		walk(_tree);
	};
}

/**
 * O Svelte trata `{` e `}` como expressão no template. Código escrito sem
 * cerca de bloco no Markdown vira texto puro e quebraria o build — escapando
 * como entidade HTML o texto renderiza igual ao GitHub, com as chaves
 * literais.
 */
function escapeBraces() {
	return (tree) => {
		const walk = (node) => {
			if (
				(node.type === 'text' || node.type === 'inlineCode') &&
				typeof node.value === 'string' &&
				/[{}]/.test(node.value)
			) {
				node.value = node.value.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
			}
			if (Array.isArray(node.children)) node.children.forEach(walk);
		};
		walk(tree);
	};
}

/**
 * Os `.md` são linkados entre si com âncoras no estilo GitHub
 * (`#1-regras-de-negócio-v1`). O GitHub injeta esses ids sozinho; aqui o
 * plugin recria a mesma regra (minúsculas, só letras/números/espaço/hífen,
 * espaços vira hífen, acentos ficam) e deduplica repetidos.
 */
function headingIds() {
	const plainText = (node) =>
		node.type === 'text' || node.type === 'inlineCode'
			? (node.value ?? '')
			: (node.children ?? []).map(plainText).join('');

	return (tree) => {
		const seen = new Map();
		const walk = (node) => {
			if (node.type === 'heading') {
				const base = plainText(node)
					.toLowerCase()
					.replace(/[^\p{L}\p{N}\s-]/gu, '')
					.trim()
					.replace(/\s+/g, '-');
				const count = seen.get(base) ?? 0;
				seen.set(base, count + 1);
				const id = count > 0 ? `${base}-${count}` : base;
				node.data = { ...(node.data ?? {}), hProperties: { ...node.data?.hProperties, id } };
			}
			if (Array.isArray(node.children)) node.children.forEach(walk);
		};
		walk(tree);
	};
}

export const mdsvexOptions = {
	extensions: ['.md'],
	remarkPlugins: [rewriteMdLinks, escapeBraces, headingIds]
};
