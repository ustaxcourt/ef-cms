import { Client } from '@opensearch-project/opensearch';
import { areAllReindexTasksFinished } from '../../shared/admin-tools/elasticsearch/check-reindex-complete';
import { baseAliases } from '../../web-api/elasticsearch/elasticsearch-aliases';
import { getClient } from '../../web-api/elasticsearch/client';
import { reindexIfNecessary } from '../elasticsearch/reindex.helpers';
import { requireEnvVars } from '../../shared/admin-tools/util';
import { setupAliases } from '../../web-api/elasticsearch/elasticsearch-alias-settings.helpers';
import { setupIndexes } from '../../web-api/elasticsearch/elasticsearch-index-settings.helpers';

requireEnvVars(['ENV', 'ELASTICSEARCH_ENDPOINT']);

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const elasticsearchEndpoint = process.env.ELASTICSEARCH_ENDPOINT!;
  const environmentName = process.env.ENV!;

  const client: Client = await getClient({
    elasticsearchEndpoint,
    environmentName,
  });

  // create new indices
  await setupIndexes({ client, environmentName });

  // reindex new indices
  await reindexIfNecessary({ client });

  // wait for reindex tasks to complete
  let reindexFinished: boolean;
  do {
    reindexFinished = await areAllReindexTasksFinished({ environmentName });
    await new Promise(resolve => setTimeout(resolve, 5000));
  } while (!reindexFinished);

  // delete the old indices
  await client.indices.delete({ index: baseAliases.map(a => a.alias) });

  // create new aliases
  await setupAliases({ client });
})();
