import { Client } from '@opensearch-project/opensearch';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { areAllReindexTasksFinished } from '../elasticsearch/check-reindex-complete';
import { baseAliases } from '../../web-api/elasticsearch/elasticsearch-aliases';
import { getClient } from '../../web-api/elasticsearch/client';
import { reindexIfNecessary } from '../elasticsearch/reindex.helpers';
import { setupAliases } from '../../web-api/elasticsearch/elasticsearch-alias-settings.helpers';
import { setupIndexes } from '../../web-api/elasticsearch/elasticsearch-index-settings.helpers';

const scriptConfig: ScriptConfig = {
  description:
    'setup-versioned-indices-and-create-aliases - Creates new versioned indices, indexes ' +
    'them, deletes the source indices, and creates aliases with the source names.',
  environment: {
    elasticsearchEndpoint: 'ELASTICSEARCH_ENDPOINT',
    environmentName: 'ENV',
  },
  requireActiveAwsSession: true,
};
const { elasticsearchEndpoint, environmentName } = parseArgsAndEnvVars(
  scriptConfig,
) as { elasticsearchEndpoint: string; environmentName: string };

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
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
