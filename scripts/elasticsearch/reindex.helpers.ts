import { Client } from '@opensearch-project/opensearch';
import { elasticsearchIndexes } from '../../web-api/elasticsearch/elasticsearch-indexes';
import {
  getBaseAliasFromIndexName,
  getElasticsearchAliases,
} from '../../web-api/elasticsearch/elasticsearch-aliases';

export const reindexIfNecessary = async ({
  client,
}: {
  client: Client;
}): Promise<void> => {
  const aliases: { alias: string; index: string }[] =
    await getElasticsearchAliases({
      client,
    });
  const indexesWithoutAliases = elasticsearchIndexes.filter(
    index => !aliases.map(alias => alias.index).includes(index),
  );
  if (indexesWithoutAliases.length) {
    await Promise.all(
      indexesWithoutAliases.map(index => {
        const baseAlias = getBaseAliasFromIndexName(index);
        const currentIndex =
          aliases.find(a => a.alias === baseAlias)?.index || baseAlias;
        return client.reindex({
          body: {
            dest: {
              index,
            },
            source: {
              index: currentIndex,
            },
          },
          wait_for_completion: false,
        });
      }),
    );
  }
};
