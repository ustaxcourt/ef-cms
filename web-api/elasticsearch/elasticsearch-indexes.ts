import { elasticsearchMappings } from './elasticsearch-mappings';

export type esIndexType = { index: string };

export const elasticsearchIndexes: string[] = Object.keys(
  elasticsearchMappings,
);
