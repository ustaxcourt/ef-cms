(async () => {
  const AWS = require('aws-sdk');

  const elasticsearch = require('elasticsearch');
  const connectionClass = require('http-aws-es');

  AWS.config.httpOptions.timeout = 300000;

  const { EnvironmentCredentials } = AWS;

  const environment = {
    elasticsearchEndpoint: process.env.ELASTICSEARCH_ENDPOINT,
    region: process.env.AWS_REGION,
  };

  const searchClientCache = new elasticsearch.Client({
    amazonES: {
      credentials: new EnvironmentCredentials('AWS'),
      region: environment.region,
    },
    apiVersion: '7.1',
    connectionClass: connectionClass,
    host: environment.elasticsearchEndpoint,
    log: 'warning',
    port: 443,
    protocol: 'https',
  });

  const indexExists = await searchClientCache.indices.exists({
    index: 'efcms',
  });
  if (!indexExists) {
    searchClientCache.indices.create({
      body: {
        settings: {
          'index.mapping.total_fields.limit': '2000',
        },
      },
      index: 'efcms',
    });
  } else {
    searchClientCache.indices.putSettings({
      body: {
        'index.mapping.total_fields.limit': '2000',
      },
      index: 'efcms',
    });
  }
})();
