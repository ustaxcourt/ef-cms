import { Client } from '@opensearch-project/opensearch';
import { elasticsearchIndexes } from '../../web-api/elasticsearch/elasticsearch-indexes';
import {
  getBaseAliasFromIndexName,
  getElasticsearchAliases,
} from '../../web-api/elasticsearch/elasticsearch-aliases';
import { getClient } from '../../web-api/elasticsearch/client';
import { requireEnvVars } from '../../shared/admin-tools/util';

requireEnvVars(['ENV', 'ELASTICSEARCH_ENDPOINT']);

(async () => {
  const elasticsearchEndpoint = process.env.ELASTICSEARCH_ENDPOINT!;
  const environmentName = process.env.ENV!;
  const client: Client = await getClient({
    elasticsearchEndpoint,
    environmentName,
  });

  const aliases: { alias: string; index: string }[] =
    await getElasticsearchAliases({
      client,
    });
  const aliasedIndexes: string[] = aliases.map(
    (alias: { alias: string; index: string }) => alias.index,
  );
  await Promise.all(
    elasticsearchIndexes.map((index: string) => {
      const baseAlias = getBaseAliasFromIndexName(index);
      if (!(index in aliasedIndexes)) {
        const currentIndex =
          aliases.find(a => a.alias === baseAlias)?.index || baseAlias;
        return client.reindex({
          body: {
            destination: {
              index,
            },
            source: {
              index: currentIndex,
            },
          },
          wait_for_completion: false,
        });
      }
    }),
  );
})();
