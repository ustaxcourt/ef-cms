import { Client } from '@opensearch-project/opensearch';
import { areAllReindexTasksFinished } from '../elasticsearch/check-reindex-complete';
import { efcmsUserMappings } from '../../web-api/elasticsearch/efcms-user-mappings';
import {
  esSettingsType,
  settings,
} from '../../web-api/elasticsearch/elasticsearch-settings';
import { getClient } from '../../web-api/elasticsearch/client';
import { getVersion, requireEnvVars } from '../../shared/admin-tools/util';

requireEnvVars(['ENV', 'SOURCE_TABLE', 'OVERRIDE_ES_NUMBER_OF_REPLICAS']);

const environmentName: string = process.env.ENV!;
const overriddenNumberOfReplicasIfNonProd: number = Number(
  process.env.OVERRIDE_ES_NUMBER_OF_REPLICAS!,
);
const index: string = 'efcms-user-practitioner-firm';
const efcmsUserPractitionerFirmMappings = {
  properties: {
    ...efcmsUserMappings.properties,
    'firmName.S': {
      type: 'text',
    },
  },
};
const esSettings: esSettingsType = settings({
  environment: environmentName,
  overriddenNumberOfReplicasIfNonProd,
});

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const version: string = await getVersion();
  const client: Client = await getClient({ environmentName, version });

  const { body: indexExists } = await client.indices.exists({ index });

  if (indexExists) {
    console.log(`${index} already exists`);
    process.exit(0);
  }

  try {
    await client.indices.create({
      body: {
        mappings: {
          dynamic: false,
          ...efcmsUserPractitionerFirmMappings,
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

  try {
    await client.reindex({
      body: {
        dest: {
          index,
        },
        source: {
          index: 'efcms-user',
        },
      },
      wait_for_completion: false,
    });
    console.log(`began reindexing ${index}`);
  } catch (error) {
    console.error(`unable to reindex ${index}:`, error);
    process.exit(1);
  }

  let reindexFinished: boolean;
  do {
    reindexFinished = await areAllReindexTasksFinished({ environmentName });
    await new Promise(resolve => setTimeout(resolve, 2000));
  } while (!reindexFinished);
  console.log('reindex complete');
})();
