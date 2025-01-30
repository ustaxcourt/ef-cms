import { elasticsearchMappings } from './elasticsearch-mappings';

export const elasticsearchIndexes: string[] = Object.keys(
  elasticsearchMappings,
);
