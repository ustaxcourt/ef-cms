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
  const {
    ELASTICSEARCH_ENDPOINT: elasticsearchEndpoint,
    ENV: environmentName,
  } = process.env;
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
        const existingAlias = aliases.find(a => a.alias === baseAlias);
        return client.reindex({
          body: {
            destination: {
              index,
            },
            source: {
              index: existingAlias.index,
            },
          },
          wait_for_completion: false,
        });
      }
    }),
  );
})();
