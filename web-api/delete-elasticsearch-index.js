(async () => {
  const AWS = require('aws-sdk');
  const {
    elasticsearchIndexes,
  } = require('./elasticsearch/elasticsearch-indexes');
  const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');
  const { Client } = require('@opensearch-project/opensearch');

  AWS.config.region = 'us-east-1';
  AWS.config.httpOptions.timeout = 300000;

  const environment = {
    elasticsearchEndpoint: process.env.ELASTICSEARCH_ENDPOINT,
    region: 'us-east-1',
  };

  const openSearchClient = new Client({
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
    node: `https://${environment.elasticsearchEndpoint}:443`,
  });

  await Promise.all(
    elasticsearchIndexes.map(async index => {
      try {
        const indexExists = await openSearchClient.indices.exists({
          body: {},
          index,
        });
        if (indexExists) {
          openSearchClient.indices.delete({
            index,
          });
        }
      } catch (e) {
        console.log(e);
      }
    }),
  );
})();
