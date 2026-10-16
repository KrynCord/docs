# KrynCord Docs

Site de documentação da KrynCord — SvelteKit + mdsvex, gerado
estaticamente. Esta pasta fica **fora do repositório da biblioteca**
(`../kryncord-lib`), que continua com o histórico, a CI e a publicação do
PyPI como sempre.

> English: this folder holds the documentation website (SvelteKit + mdsvex).
> It reads the Markdown files from `../kryncord-lib/docs` at build time, so
> there is a single source of truth. Run `npm.cmd install` then
> `npm.cmd run dev`.

## Rodando

```bash
npm.cmd install      # npm.ps1 está bloqueado por política de execução
npm.cmd run dev      # http://localhost:5173
npm.cmd run build    # gera ./build (HTML estático)
npm.cmd run preview  # serve o build localmente
```

Na primeira instalação o npm pergunta sobre o script de instalação do
`esbuild` — `npm.cmd install-scripts approve esbuild` resolve.

## De onde vem o conteúdo

Os `.md` **não estão duplicados aqui**. O site lê direto de
`../kryncord-lib/docs/**/*.md` no build (ver `src/lib/content.ts`):

- o README do GitHub e o do PyPI apontam para os mesmos arquivos do repo;
- o site nunca fica defasado: editar um `.md` no repo muda o site no
  próximo build.

O plugin `mdsvex.config.js` faz o translation para a web:

| Problema | Solução |
| --- | --- |
| Links `arquivo.md` entre docs | vira rota do site, relativa ao idioma |
| Link que sai de `docs/` | vira URL absoluta do GitHub |
| `{` `}` em código sem cerca | escapado como entidade (igual ao GitHub) |
| Âncoras `#seção-do-título` | ids gerados com a regra do GitHub |

`reference/ideiabase.md` está fora do build: é o rascunho de design com
marcação `<Callout>`/`<Tabs>` que o site ainda não implementa. O arquivo
continua no repo.

## Estrutura

```
docs/
├── src/lib/content.ts      carrega os .md do repo (glob)
├── src/lib/i18n.ts         textos de interface (pt-BR / en)
├── src/lib/versions.ts     versões da documentação (hoje: 0.1)
├── src/routes/[lang]/…     /pt-BR/docs/... e /en/docs/...
└── mdsvex.config.js        plugin de links, chaves e âncoras
```

Rotas: `/{idioma}/docs` (índice), `/{idioma}/docs/{categoria}` e
`/{idioma}/docs/{caminho-do-arquivo}`. Tudo é pré-renderizado — a saída em
`build/` são só arquivos estáticos, servem em qualquer hospedagem.

## O que ainda não tem

- **Tradução**: as rotas `/en/...` existem e avisam que a página ainda está
  em português; falta traduzir o conteúdo.
- **Versões antigas**: `versions.ts` já prepara o segmento, mas só a `0.1`
  existe.
- **Busca e componentes** (`Callout`, `Tabs`): quando existirem,
  reinclua o `ideiabase.md`.
- **CLI** (`kryncord-cli`, Typer): produto separado, ainda não criado.
