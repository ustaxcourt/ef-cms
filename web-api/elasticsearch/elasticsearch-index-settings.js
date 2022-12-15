(async () => {
  const AWS = require('aws-sdk');
  const { elasticsearchIndexes } = require('./elasticsearch-indexes');
  AWS.config.region = 'us-east-1';
  const mappings = require('./elasticsearch-mappings');
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

  let searchClientCache = new Client({
    node: 'http://localhost:9200',
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
