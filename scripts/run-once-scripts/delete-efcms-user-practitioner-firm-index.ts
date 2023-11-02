import { getClient } from '../../web-api/elasticsearch/client';
import { getVersion, requireEnvVars } from '../../shared/admin-tools/util';

requireEnvVars(['ENV']);

const environmentName = process.env.ENV!;
const index = 'efcms-user-practitioner-firm';

(async () => {
  const version = await getVersion();
  const client = await getClient({ environmentName, version });

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
