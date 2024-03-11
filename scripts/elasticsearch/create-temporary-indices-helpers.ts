import { Client } from '@opensearch-project/opensearch';
import { getClient } from '../../web-api/elasticsearch/client';
import {
  reindexIfNecessary,
  waitForReindexTasksToComplete,
} from './reindex.helpers';
import { setupIndexes } from '../../web-api/elasticsearch/elasticsearch-index-settings.helpers';

export const createNewIndicesFromLocalMappings = async ({
  environmentName,
}: {
  environmentName: string;
}): Promise<void> => {
  const client: Client = await getClient({ environmentName });

  console.log('Creating new indices from locally defined mappings');
  await setupIndexes({ client, environmentName });

  console.log('Reindexing new indices');
  try {
    await reindexIfNecessary({ client });
  } catch (err) {
    console.error('Unable to reindex', err);
    process.exit(1);
  }
  await waitForReindexTasksToComplete({ environmentName });
  console.log('Reindex complete');
};
