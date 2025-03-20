import { Client } from '@opensearch-project/opensearch';
import {
  systemPerformanceLogsMappings,
  systemPerformanceLogsIndex,
} from '../../web-api/elasticsearch/system-performance-logs-mappings';
import {
  esSettingsType,
  settings,
} from '../../web-api/elasticsearch/elasticsearch-settings';
import { getClient } from '../../web-api/elasticsearch/client';
import { requireEnvVars } from '../../shared/admin-tools/util';

requireEnvVars(['ENV', 'ELASTICSEARCH_INFO_ENDPOINT']);

const environmentName: string = process.env.ENV!;
const elasticsearchEndpoint: string = process.env.ELASTICSEARCH_INFO_ENDPOINT!;
const index: string = systemPerformanceLogsIndex;

const esSettings: esSettingsType = settings({
  environment: environmentName,
  overriddenNumberOfReplicasIfNonProd: 0,
});

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const client: Client = await getClient({
    elasticsearchEndpoint,
    environmentName,
  });
  const { body: indexExists } = await client.indices.exists({ index });

  if (indexExists) {
    await client.indices.delete({ index });
  }

  try {
    await client.indices.create({
      body: {
        mappings: {
          dynamic: false,
          ...systemPerformanceLogsMappings,
        },
        settings: esSettings,
      },
      index,
    });
    console.log(`created ${index}`);
  } catch (error) {
    console.error(`unable to create ${index}:`, error);
    process.exit(1);
  }
})();
