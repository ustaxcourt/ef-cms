import { Client } from '@opensearch-project/opensearch';
import { elasticsearchIndexes } from './elasticsearch-indexes';
import { elasticsearchMappings } from './elasticsearch-mappings';
import { esSettingsType } from './elasticsearch-settings';
import { getClient } from './client';
import { settings } from './elasticsearch-settings';

(async () => {
  const environmentName: string = process.env.ENV || 'local';
  const elasticsearchEndpoint: string = process.argv[2];
  const overriddenNumberOfReplicasIfNonProd: number = Number(
    process.env.OVERRIDE_ES_NUMBER_OF_REPLICAS,
  );

  const openSearchClient: Client = await getClient({
    elasticsearchEndpoint,
    environmentName,
  });

  const esSettings: esSettingsType = settings({
    environment: environmentName,
    overriddenNumberOfReplicasIfNonProd,
  });

  await Promise.all(
    elasticsearchIndexes.map(async (index: string) => {
      try {
        const { body: indexExists } = await openSearchClient.indices.exists({
          index,
        });

        if (!indexExists) {
          await openSearchClient.indices.create({
            body: {
              mappings: {
                dynamic: false,
                ...elasticsearchMappings[index],
              },
              settings: esSettings,
            },
            index,
          });
        } else {
          openSearchClient.indices.putSettings({
            body: {
              index: {
                max_result_window: esSettings.index.max_result_window,
                number_of_replicas: esSettings.index.number_of_replicas,
              },
            },
            index,
          });
        }
      } catch (e) {
        console.log(
          'Error trying to create or update the OpenSearch indices: ',
          e,
        );
      }
    }),
  );
})();
