(async () => {
  const AWS = require('aws-sdk');
  const { elasticsearchIndexes } = require('./elasticsearch-indexes');
  AWS.config.region = 'us-east-1';
  const connectionClass = require('http-aws-es');
  const elasticsearch = require('elasticsearch');
  const mappings = require('./elasticsearch-mappings');
  const { settings } = require('./elasticsearch-settings');

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
  const ELASTICSEARCH_API_VERSION = '7.4';

  const environment = {
    elasticsearchEndpoint: process.env.ELASTICSEARCH_ENDPOINT,
    region: 'us-east-1',
  };

  const searchClientCache = new elasticsearch.Client({
    amazonES: {
      credentials: new EnvironmentCredentials('AWS'),
      region: environment.region,
    },
    apiVersion: ELASTICSEARCH_API_VERSION,
    connectionClass: connectionClass,
    host: {
      host: environment.elasticsearchEndpoint,
      port: process.env.ELASTICSEARCH_PORT || 443,
      protocol: process.env.ELASTICSEARCH_PROTOCOL || 'https',
    },
    log: 'warning',
  });

  await Promise.all(
    elasticsearchIndexes.map(async index => {
      try {
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
              settings,
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
