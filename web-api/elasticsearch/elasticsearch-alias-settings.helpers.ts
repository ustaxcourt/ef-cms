import { Client } from '@opensearch-project/opensearch';
import { baseAliases, esAliasType } from './elasticsearch-aliases';
import { elasticsearchIndexes } from './elasticsearch-indexes';

export const setupAliases = async ({
  client,
}: {
  client: Client;
}): Promise<void> => {
  const existingAliases: esAliasType[] =
    (await client.cat.aliases({ format: 'json' })).body?.filter(
      (a: esAliasType) => {
        return a.alias !== '.kibana';
      },
    ) || [];
  const aliasedIndexes: string[] = existingAliases.map(a => a.index) || [];
  for (const oldAlias of existingAliases) {
    if (!elasticsearchIndexes.includes(oldAlias.index)) {
      await client.indices.deleteAlias({
        index: oldAlias.index,
        name: oldAlias.alias,
      });
    }
  }
  for (const newAlias of baseAliases) {
    if (!aliasedIndexes.includes(newAlias.index)) {
      await client.indices.putAlias({
        index: newAlias.index,
        name: newAlias.alias,
      });
    }
  }
};
