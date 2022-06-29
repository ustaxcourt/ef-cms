(async () => {
  const AWS = require('aws-sdk');
  const { elasticsearchIndexes } = require('./elasticsearch-indexes');
  AWS.config.region = 'us-east-1';
  const connectionClass = require('http-aws-es');
  const elasticsearch = require('elasticsearch');
  const mappings = require('./elasticsearch-mappings');
  const {
    ELASTICSEARCH_API_VERSION,
    settings,
  } = require('./elasticsearch-settings');

  AWS.config.httpOptions.timeout = 300000;
  const { EnvironmentCredentials } = AWS;

  // eslint-disable-next-line spellcheck/spell-checker
  /*
    Supported versions can be found at
    https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/what-is-amazon-elasticsearch-service.html#aes-choosing-version
    Changes to the API version ought to also be reflected in
    - elasticsearch.tf
    - delete-elasticsearch-index.js
  */
  const environment = {
    region: 'us-east-1',
  };

  environment.elasticsearchEndpoint = process.argv[2];

  const searchClientCache = new elasticsearch.Client({
    amazonES: {
      credentials: new EnvironmentCredentials('AWS'),
      region: environment.region,
    },
    apiVersion: ELASTICSEARCH_API_VERSION,
    connectionClass,
    host: {
      host: environment.elasticsearchEndpoint,
      port: process.env.ELASTICSEARCH_PORT || 443,
      protocol: process.env.ELASTICSEARCH_PROTOCOL || 'https',
    },
    log: 'warning',
  });

  const overriddenNumberOfReplicasIfNonProd =
    process.env.OVERRIDE_ES_NUMBER_OF_REPLICAS;
  const deployingEnvironment = process.env.ENV;

  await Promise.all(
    elasticsearchIndexes.map(async index => {
      try {
        const esSettings = settings({
          environment: deployingEnvironment,
          overriddenNumberOfReplicasIfNonProd,
        });

        const indexExists = await searchClientCache.indices.exists({
          body: {},
          index,
        });

        if (!indexExists) {
          searchClientCache.indices.create({
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
        console.log(e);
      }
    }),
  );
})();
