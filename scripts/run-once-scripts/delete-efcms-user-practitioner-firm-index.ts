import { Client } from '@opensearch-project/opensearch';
import { getClient } from '../../web-api/elasticsearch/client';
import { getVersion, requireEnvVars } from '../../shared/admin-tools/util';

requireEnvVars(['ENV']);

const environmentName: string = process.env.ENV!;
const index: string = 'efcms-user-practitioner-firm';

(async () => {
  const version: string = await getVersion();
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
