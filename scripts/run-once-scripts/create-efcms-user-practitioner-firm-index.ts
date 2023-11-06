import * as efcmsUserMappings from '../../web-api/elasticsearch/efcms-user-mappings';
import { getClient } from '../../web-api/elasticsearch/client';
import { getVersion, requireEnvVars } from '../../shared/admin-tools/util';
import { settings } from '../../web-api/elasticsearch/elasticsearch-settings';

requireEnvVars(['ENV', 'OVERRIDE_ES_NUMBER_OF_REPLICAS']);

const environmentName = process.env.ENV!;
const overriddenNumberOfReplicasIfNonProd =
  process.env.OVERRIDE_ES_NUMBER_OF_REPLICAS!;
const index = 'efcms-user-practitioner-firm';
const efcmsUserPractitionerFirmMappings = {
  properties: {
    ...efcmsUserMappings.properties,
    'firmName.S': {
      type: 'text',
    },
  },
};
const esSettings = settings({
  environment: environmentName,
  overriddenNumberOfReplicasIfNonProd,
});

const areAllReindexTasksFinished = async ({ client }): Promise<boolean> => {
  try {
    const tasks = await client.cat.tasks({ format: 'json' });
    if (tasks && tasks.body && tasks.body.length) {
      const reindexTasks = tasks.body.filter(
        (task: { action: string }) =>
          task.action === 'indices:data/write/reindex',
      );
      const numReindexTasks = reindexTasks ? reindexTasks.length : 0;
      return numReindexTasks === 0;
    }
  } catch (error) {
    console.error('unable to list elasticsearch tasks', error);
  }
  return true;
};

(async () => {
  const version = await getVersion();
  const client = await getClient({ environmentName, version });

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
    reindexFinished = await areAllReindexTasksFinished({ client });
    await new Promise(resolve => setTimeout(resolve, 5000));
  } while (!reindexFinished);
  console.log('reindex complete');
})();
