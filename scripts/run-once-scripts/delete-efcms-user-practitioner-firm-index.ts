import { Client } from '@opensearch-project/opensearch';
import { getClient } from '../../web-api/elasticsearch/client';
import {
  getSourceTableInfo,
  requireEnvVars,
} from '../../shared/admin-tools/util';

requireEnvVars(['ENV']);

const environmentName: string = process.env.ENV!;
const index: string = 'efcms-user-practitioner-firm';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const { version } = await getSourceTableInfo();
  const client: Client = await getClient({ environmentName, version });

  const { body: indexExists } = await client.indices.exists({ index });

  if (!indexExists) {
    console.log(`${index} does not exist`);
    process.exit(0);
  }

  try {
    await client.indices.delete({ index });
    console.log(`deleted ${index}`);
  } catch (error) {
    console.error(`unable to delete ${index}:`, error);
    process.exit(1);
  }
})();
