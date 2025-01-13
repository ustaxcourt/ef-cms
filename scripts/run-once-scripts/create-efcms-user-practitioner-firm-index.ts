#!/usr/bin/env -S npx ts-node --transpile-only

import { Client } from '@opensearch-project/opensearch';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { areAllReindexTasksFinished } from '../elasticsearch/check-reindex-complete';
import { efcmsUserMappings } from '../../web-api/elasticsearch/efcms-user-mappings';
import { settings } from '../../web-api/elasticsearch/elasticsearch-settings';
import { getClient } from '../../web-api/elasticsearch/client';

const scriptConfig: ScriptConfig = {
  description:
    'create-efcms-user-practitioner-firm-index - Creates a temporary ' +
    'efcms-user-practitioner-firm OpenSearch index based on the existing ' +
    'efcms-user index.',
  environment: {
    elasticsearchEndpoint: 'ELASTICSEARCH_ENDPOINT',
    environmentName: 'ENV',
    overrideEsNumberOfReplicas: 'OVERRIDE_ES_NUMBER_OF_REPLICAS',
  },
  requireActiveAwsSession: true,
};
const { elasticsearchEndpoint, environmentName, overrideEsNumberOfReplicas } =
  parseArgsAndEnvVars(scriptConfig) as {
    elasticsearchEndpoint: string;
    environmentName: string;
    overrideEsNumberOfReplicas: string;
  };

const overriddenNumberOfReplicasIfNonProd: number = Number(
  overrideEsNumberOfReplicas,
);
const index: string = 'efcms-user-practitioner-firm';

const esSettings = settings({
  environment: environmentName,
  overriddenNumberOfReplicasIfNonProd,
});

(async () => {
  const client: Client = await getClient({
    elasticsearchEndpoint,
    environmentName,
  });

  const { body: indexExists } = await client.indices.exists({ index });

  if (indexExists) {
    console.log(`${index} already exists`);
    process.exit(0);
  }

  try {
    await client.indices.create({
      body: {
        mappings: {
          dynamic: 'false',
          properties: {
            ...efcmsUserMappings.properties,
            'firmName.S': {
              type: 'text',
            },
          },
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
