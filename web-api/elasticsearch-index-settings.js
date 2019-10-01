(async () => {
  let indexExists;
  try {
    const AWS = require('aws-sdk');

    const elasticsearch = require('elasticsearch');
    const connectionClass = require('http-aws-es');

    AWS.config.httpOptions.timeout = 300000;

    const { EnvironmentCredentials } = AWS;

    const environment = {
      elasticsearchEndpoint: process.env.ELASTICSEARCH_ENDPOINT,
      region: 'us-east-1',
    };

    console.log('elasticsearch endpoint is', environment.elasticsearchEndpoint);

    const searchClientCache = new elasticsearch.Client({
      amazonES: {
        credentials: new EnvironmentCredentials('AWS'),
        region: environment.region,
      },
      apiVersion: '7.1',
      connectionClass: connectionClass,
      host: {
        host: `${environment.elasticsearchEndpoint}`,
        port: 443,
        protocol: 'https',
      },
      log: 'warning',
    });

    await searchClientCache.index({
      body: { something: 'something' },
      id: '1234567890',
      index: 'efcms',
    });

    /*searchClientCache.indices.create({
      body: {
        settings: {
          'index.mapping.total_fields.limit': '2000',
        },
      },
      index: 'efcms',
    });*/

    /*indexExists = await searchClientCache.indices.exists({
      body: {},
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
    }*/
  } catch (e) {
    console.log('inside the catch');
    console.log(e);
  }
})();
