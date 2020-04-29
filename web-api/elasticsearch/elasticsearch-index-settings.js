(async () => {
  const AWS = require('aws-sdk');
  const elasticsearchIndexes = require('./elasticsearch-indexes');
  AWS.config.region = 'us-east-1';
  const connectionClass = require('http-aws-es');
  const elasticsearch = require('elasticsearch');
  const settings = require('./elasticsearch-settings');

  AWS.config.httpOptions.timeout = 300000;

  const { EnvironmentCredentials } = AWS;

  const environment = {
    elasticsearchEndpoint: process.env.ELASTICSEARCH_ENDPOINT,
    region: 'us-east-1',
  };

  const searchClientCache = new elasticsearch.Client({
    amazonES: {
      credentials: new EnvironmentCredentials('AWS'),
      region: environment.region,
    },
    apiVersion: '7.1',
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
              settings,
            },
            index,
          });
        } else {
          searchClientCache.indices.putSettings({
            body: { 'index.mapping.total_fields.limit': '1000' },
            index,
          });
        }
      } catch (e) {
        console.log(e);
      }
    }),
  );
})();
