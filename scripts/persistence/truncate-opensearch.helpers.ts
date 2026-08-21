import { Client } from '@opensearch-project/opensearch';
import { elasticsearchMappings } from '../../web-api/elasticsearch/elasticsearch-mappings';
import { getClient } from '../../web-api/elasticsearch/client';
import { setupAliases } from '../../web-api/elasticsearch/elasticsearch-alias-settings.helpers';
import { setupIndexes } from '../../web-api/elasticsearch/elasticsearch-index-settings.helpers';

/**
 * Deletes each OpenSearch index defined in `elasticsearch-mappings.ts`, then
 * re-creates them (and their aliases) using the existing helpers used by the
 * application's deployment scripts.
 */
export const truncateAllOpenSearchIndices = async ({
  elasticsearchEndpoint,
  environmentName,
  client,
}: {
  elasticsearchEndpoint: string;
  environmentName: string;
  client?: Client;
}): Promise<{ deleted: string[] }> => {
  const openSearchClient: Client =
    client ||
    (await getClient({
      elasticsearchEndpoint,
      environmentName,
    }));

  const indicesToDelete: string[] = Object.keys(elasticsearchMappings);
  const deleted: string[] = [];

  for (const index of indicesToDelete) {
    try {
      const { body: indexExists } = await openSearchClient.indices.exists({
        index,
      });
      if (indexExists) {
        await openSearchClient.indices.delete({ index });
        deleted.push(index);
        console.log(`Deleted OpenSearch index: ${index}`);
      } else {
        console.log(`OpenSearch index does not exist, skipping: ${index}`);
      }
    } catch (err) {
      console.error(`Error deleting OpenSearch index ${index}:`, err);
      throw err;
    }
  }

  await setupIndexes({ client: openSearchClient, environmentName });
  await setupAliases({ client: openSearchClient });

  console.log('OpenSearch indices and aliases recreated.');
  return { deleted };
};
