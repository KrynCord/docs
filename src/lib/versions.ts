/**
 * Versões publicadas da documentação. Hoje existe só a corrente, mas a rota
 * já recebe o segmento de idioma separado da versão para quando a 0.2.0
 * existir os dois conviverem sem reescrever links.
 */
export const VERSIONS = ['0.1'] as const;
export const CURRENT_VERSION: string = VERSIONS[0];
