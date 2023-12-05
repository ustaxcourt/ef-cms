import { Client } from '@opensearch-project/opensearch';
import { deleteUnaliasedIndices } from './elasticsearch/elasticsearch-index-settings.helpers';
import { getClient } from './elasticsearch/client';

(async () => {
  const environmentName: string = process.env.ENV || 'local';
  const elasticsearchEndpoint: string = process.argv[2];

  const client: Client = await getClient({
    elasticsearchEndpoint,
    environmentName,
  });

  await deleteUnaliasedIndices({ client });
})();
