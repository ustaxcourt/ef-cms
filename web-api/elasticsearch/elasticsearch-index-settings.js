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
  };

  AWS.config.httpOptions.timeout = 300000;

  const overriddenNumberOfReplicasIfNonProd =
    process.env.OVERRIDE_ES_NUMBER_OF_REPLICAS;
  const deployingEnvironment = process.env.ENV;
  environment.elasticsearchEndpoint = process.argv[2];
  console.log(
    '***environment.elasticsearchEndpoint',
    environment.elasticsearchEndpoint,
  );

  const host = environment.elasticsearchEndpoint;
  const port = process.env.ELASTICSEARCH_PORT || 443;
  const protocol = process.env.ELASTICSEARCH_PROTOCOL || 'https';

  console.log(`***interpolated node: ${protocol}://${host}:${port}`);

  let searchClientCache = new Client({
    node: `${protocol}://${host}:${port}`,

    ...AwsSigv4Signer({
      getCredentials: () =>
        new Promise((resolve, reject) => {
          // Any other method to acquire a new Credentials object can be used.
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

    // ssl: {
    //   ca: fs.readFileSync(ca_certs_path),
    //   // You can turn off certificate verification (rejectUnauthorized: false) if you're using self-signed certificates with a hostname mismatch.
    //   // cert: fs.readFileSync(client_cert_path),
    //   // key: fs.readFileSync(client_key_path)
    // },
  });

  // const searchClientCache = new Client({
  //   amazonES: {
  //     credentials: new EnvironmentCredentials('AWS'),
  //     region: environment.region,
  //   },
  //   apiVersion: ELASTICSEARCH_API_VERSION,
  //   connectionClass,
  //   host: {
  //     host: environment.elasticsearchEndpoint,
  //     port: process.env.ELASTICSEARCH_PORT || 443,
  //     protocol: process.env.ELASTICSEARCH_PROTOCOL || 'https',
  //   },
  //   log: 'warning',
  // });

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
