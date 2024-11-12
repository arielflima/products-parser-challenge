export const FOOD_DATA_INDEX_URL =
  process.env.INDEX_URL ??
  'https://challenges.coode.sh/food/data/json/index.txt';
export const FOOD_DATA_BASE_URL =
  process.env.BASE_URL ?? 'https://challenges.coode.sh/food/data/json/';
export const ELASTICSEARCH_HOST =
  process.env.ELASTICSEARCH_HOST ?? 'http://localhost:9200';
export const API_KEY = process.env.API_KEY;
export const API_PORT = process.env.API_PORT ?? '3000';
export const TIMEZONE = 'America/Sao_Paulo';
export const DATE_MASK_DEFAULT = 'dd/MM/yyyy HH:mm:ssXXX (z)';
export const IMPORT_FOOD_DATA_LIMIT = '100';
export const MAX_PAGE_SIZE = '500';
