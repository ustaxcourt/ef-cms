import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws';
import { Client } from '@opensearch-project/opensearch';
import { elasticsearchIndexes } from './elasticsearch-indexes';
import { elasticsearchMappings } from './elasticsearch-mappings';
import { esSettingsType } from './elasticsearch-settings';
import { settings } from './elasticsearch-settings';
import AWS from 'aws-sdk';

(async () => {
  AWS.config.region = 'us-east-1';
  if (AWS.config.httpOptions) {
    AWS.config.httpOptions.timeout = 300000;
  }

  const environment: {
    elasticsearchEndpoint: string;
    region: string;
    stage: string;
  } = {
    elasticsearchEndpoint: process.argv[2],
    region: 'us-east-1',
    stage: process.env.ENV || 'local',
  };

  const overriddenNumberOfReplicasIfNonProd: number = Number(
    process.env.OVERRIDE_ES_NUMBER_OF_REPLICAS,
  );
  const deployingEnvironment: string = process.env.ENV!;

  const openSearchClient = new Client({
    ...AwsSigv4Signer({
      getCredentials: () =>
        new Promise((resolve, reject) => {
          AWS.config.getCredentials((err, credentials) => {
            if (err) {
              reject(err);
            } else {
              if (credentials) {
                resolve(credentials);
              }
            }
          });
        }),
      region: environment.region,
    }),
    node:
      environment.stage === 'local'
        ? environment.elasticsearchEndpoint
        : `https://${environment.elasticsearchEndpoint}:443`,
  });

  const esSettings: esSettingsType = settings({
    environment: deployingEnvironment,
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
