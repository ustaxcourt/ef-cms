import { areAllReindexTasksFinished } from './check-reindex-complete';
import {
  efcmsCaseIndex,
  efcmsCaseMappings,
} from '../../../web-api/elasticsearch/efcms-case-mappings';
import {
  type esSettingsType,
  settings,
} from '../../../web-api/elasticsearch/elasticsearch-settings';
import { getClient } from '../../../web-api/elasticsearch/client';
import { requireEnvVars } from '../util';

requireEnvVars(['ENV', 'ELASTICSEARCH_ENDPOINT']);

(async () => {
  // get a client
  const environmentName = process.env.ENV!;
  const elasticsearchEndpoint = process.env.ELASTICSEARCH_ENDPOINT!;
  const overriddenNumberOfReplicasIfNonProd: number = Number(
    process.env.OVERRIDE_ES_NUMBER_OF_REPLICAS,
  );

  const client = await getClient({ elasticsearchEndpoint, environmentName });
  const esSettings: esSettingsType = settings({
    environment: environmentName,
    overriddenNumberOfReplicasIfNonProd,
  });

  const newMappings = {
    properties: {
      ...efcmsCaseMappings.properties,
      'filingDate.S': {
        type: 'date',
      },
      'partyType.S': {
        type: 'keyword',
      },
    },
  };
  console.log(newMappings);
  const index = 'efcms-case-v2';

  // create a new index
  let result = await client.indices.create({
    body: {
      mappings: {
        dynamic: false,
        ...newMappings,
      },
      settings: esSettings,
    },
    index,
  });

  console.log('new index created', { result });

  // issue api command to commence reindex
  result = await client.reindex({
    body: {
      dest: {
        index,
      },
      source: {
        index: efcmsCaseIndex,
      },
    },
    wait_for_completion: false,
  });
  console.log('starting the reindex', { result });

  // let us know when it's done
  let reindexFinished: boolean;
  do {
    reindexFinished = await areAllReindexTasksFinished({ environmentName });
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('...');
  } while (!reindexFinished);

  console.log('all done!');
})();
