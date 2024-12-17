#!/usr/bin/env -S npx ts-node --transpile-only

import { Client } from '@opensearch-project/opensearch';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { getClient } from '../../web-api/elasticsearch/client';

const scriptConfig: ScriptConfig = {
  description:
    'delete-efcms-user-practitioner-firm-index - Deletes the temporary ' +
    'efcms-user-practitioner-firm OpenSearch index if it exists.',
  environment: {
    elasticsearchEndpoint: 'ELASTICSEARCH_ENDPOINT',
    environmentName: 'ENV',
  },
  requireActiveAwsSession: true,
};
const { elasticsearchEndpoint, environmentName } = parseArgsAndEnvVars(
  scriptConfig,
) as {
  elasticsearchEndpoint: string;
  environmentName: string;
};
const index: string = 'efcms-user-practitioner-firm';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const client: Client = await getClient({
    elasticsearchEndpoint,
    environmentName,
  });

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
