import { Client } from '@opensearch-project/opensearch';
import { getClient } from '../../web-api/elasticsearch/client';
import { reindexIfNecessary } from './reindex.helpers';
import { requireEnvVars } from '../../shared/admin-tools/util';

requireEnvVars(['ENV', 'ELASTICSEARCH_ENDPOINT']);

(async () => {
  const elasticsearchEndpoint = process.env.ELASTICSEARCH_ENDPOINT!;
  const environmentName = process.env.ENV!;
  const client: Client = await getClient({
    elasticsearchEndpoint,
    environmentName,
  });

  await reindexIfNecessary({ client });
})();
