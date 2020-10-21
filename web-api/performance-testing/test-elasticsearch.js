const AWS = require('aws-sdk');
const { EnvironmentCredentials } = AWS;
const connectionClass = require('http-aws-es');
const elasticsearch = require('elasticsearch');
// const mappings = require('../elasticsearch/elasticsearch-mappings');
// const migratedCase = require('./migratedCase.json');
// const { settings } = require('../elasticsearch/elasticsearch-settings');

const esClient = new elasticsearch.Client({
  amazonES: {
    credentials: new EnvironmentCredentials('AWS'),
    region: 'us-east-1',
  },
  apiVersion: '7.4',
  awsConfig: new AWS.Config({ region: 'us-east-1' }),
  connectionClass: connectionClass,
  host:
    'https://search-efcms-search-exp3-3-43upjde4fz3yonvisirrx2hscu.us-east-1.es.amazonaws.com',
  log: 'warning',
  port: 443,
  protocol: 'https',
});

// let docketNumberCounter = 0;

// const getMigratedCase = () => {
//   const docketNumber = `${docketNumberCounter++}-79`;
//   const docketNumberSuffix = 'L';
//   const docketNumberWithSuffix = `${docketNumber}L`;
//   return {
//     ...migratedCase,
//     docketNumber,
//     docketNumberSuffix,
//     docketNumberWithSuffix,
//   };
// };

(async () => {
  // await esClient.indices.create({
  //   body: {
  //     mappings: {
  //       dynamic: false,
  //       ...mappings['efcms-testing'],
  //     },
  //     settings,
  //   },
  //   index: 'efcms-testing',
  // });

  // const TOTAL_ITEMS = 1000;
  // const CHUNK_SIZE = 100;
  // const CHUNKS = TOTAL_ITEMS / CHUNK_SIZE;
  // for (let i = 0; i < CHUNKS; i++) {
  //   const chunk = [];
  //   for (let j = 0; j < CHUNK_SIZE; j++) {
  //     let aCase = getMigratedCase();
  //     aCase = {
  //       ...aCase,
  //       pk: `case|${aCase.docketNumber}`,
  //       sk: `case|${aCase.docketNumber}`,
  //     };
  //     console.log(`adding ${aCase.docketNumber}`);
  //     chunk.push(
  //       esClient.index({
  //         body: AWS.DynamoDB.Converter.marshall(aCase),
  //         id: `${aCase.docketNumber}-my-unique-id`,
  //         index: 'efcms-testing',
  //       }),
  //     );
  //   }
  //   await Promise.all(chunk);
  // }

  // for (let j = 0; j < 5; j++) {
  //   let body = [];

  //   for (let i = 0; i < 200; i++) {
  //     let aCase = getMigratedCase();
  //     aCase = {
  //       ...aCase,
  //       pk: `case|${aCase.docketNumber}`,
  //       sk: `case|${aCase.docketNumber}`,
  //     };
  //     console.log(`adding ${aCase.docketNumber}`);
  //     body.push({
  //       index: {
  //         _id: `${aCase.docketNumber}-my-unique-id`,
  //         _index: 'efcms-testing',
  //       },
  //     });
  //     body.push(AWS.DynamoDB.Converter.marshall(aCase));
  //   }

  //   await esClient.bulk({
  //     body,
  //     refresh: false,
  //   });
  // }

  const results = await esClient.count({
    body: {
      query: {
        match_all: {},
      },
    },
    index: 'efcms-case',
  });

  console.log('we found this many records: ', results);
})();
