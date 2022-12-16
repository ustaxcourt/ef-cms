(async () => {
  const AWS = require('aws-sdk');
  const { elasticsearchIndexes } = require('./elasticsearch-indexes');
  AWS.config.region = 'us-east-1';
  const mappings = require('./elasticsearch-mappings');
  const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');
  const { Client } = require('@opensearch-project/opensearch');
  const { settings } = require('./elasticsearch-settings');

  const environment = {
    region: 'us-east-1',
    stage: process.env.STAGE || 'local',
  };

  AWS.config.httpOptions.timeout = 300000;

  const overriddenNumberOfReplicasIfNonProd =
    process.env.OVERRIDE_ES_NUMBER_OF_REPLICAS;
  const deployingEnvironment = process.env.ENV;
  environment.elasticsearchEndpoint = process.argv[2];

  const host = environment.elasticsearchEndpoint;
  const port = process.env.ELASTICSEARCH_PORT || 443;
  const protocol = process.env.ELASTICSEARCH_PROTOCOL || 'https';

  const searchClientCache = new Client({
    ...AwsSigv4Signer({
      getCredentials: () =>
        new Promise((resolve, reject) => {
          AWS.config.getCredentials((err, credentials) => {
            if (err) {
              reject(err);
            } else {
              resolve(credentials);
            }
          });
        }),
      region: 'us-east-1',
    }),
    node:
      environment.stage === 'local'
        ? environment.elasticsearchEndpoint
        : `${protocol}://${host}:${port}`,
  });

  console.log('**** here 3 *****');

  const esSettings = settings({
    environment: deployingEnvironment,
    overriddenNumberOfReplicasIfNonProd,
  });

  await Promise.all(
    elasticsearchIndexes.map(async index => {
      try {
        const { body: indexExists } = await searchClientCache.indices.exists({
          body: {},
          index,
        });

        console.log('does ', index, 'exist? ', indexExists);

        if (!indexExists) {
          console.log('going to create ', index);
          await searchClientCache.indices.create({
            body: {
              mappings: {
                dynamic: false,
                ...mappings[index],
              },
              settings: esSettings,
            },
            index,
          });
        } else {
          searchClientCache.indices.putSettings({
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
        console.log('***** \n\n\n', e);
      }
    }),
  );
})();
