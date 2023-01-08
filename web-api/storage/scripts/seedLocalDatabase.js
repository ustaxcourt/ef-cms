const AWS = require('aws-sdk');
const seedEntries = require('../fixtures/seed');
const {
  migrateItems: validationMigration,
} = require('../../migration-terraform/main/lambdas/migrations/0000-validate-all-items');
const { chunk: splitIntoChunks } = require('lodash');
const { createCase1 } = require('./cases/createCase1');
const { createUsers } = require('./createUsers');

AWS.config = new AWS.Config();
AWS.config.region = 'us-east-1';

Error.stackTraceLimit = Infinity;

const client = new AWS.DynamoDB.DocumentClient({
  credentials: {
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
  },
  endpoint: process.env.DYNAMODB_ENDPOINT ?? 'http://localhost:8000',
  region: 'us-east-1',
});

const putEntries = async entries => {
  const chunks = splitIntoChunks(entries, 25);
  for (let chunk of chunks) {
    try {
      validationMigration(chunk);
    } catch (e) {
      console.log('Seed data is invalid, exiting.');
      process.exit(1);
    }

    await client
      .batchWrite({
        RequestItems: {
          'efcms-local': chunk.map(item => ({
            PutRequest: {
              Item: item,
            },
          })),
        },
      })
      .promise();
  }
};

module.exports.seedLocalDatabase = async entries => {
  if (entries) {
    await putEntries(entries);
  } else {
    await createUsers();

    await putEntries(seedEntries);

    await createCase1();
  }
};
