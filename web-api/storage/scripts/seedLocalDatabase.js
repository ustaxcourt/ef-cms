const AWS = require('aws-sdk');
const seedEntries = require('../fixtures/seed');
const { createCase1 } = require('./cases/createCase1');
const { createOrder } = require('./cases/createOrder');
const { createUsers } = require('./createUsers');

AWS.config = new AWS.Config();
AWS.config.region = 'us-east-1';

Error.stackTraceLimit = Infinity;

const client = new AWS.DynamoDB.DocumentClient({
  credentials: {
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
  },
  endpoint: 'http://localhost:8000',
  region: 'us-east-1',
});

const putEntries = async entries => {
  await Promise.all(
    entries.map(item =>
      client
        .put({
          Item: item,
          TableName: 'efcms-local',
        })
        .promise(),
    ),
  );
};

module.exports.seedLocalDatabase = async entries => {
  if (entries) {
    await putEntries(entries);
  } else {
    await createUsers();

    await putEntries(seedEntries);

    const docketNumber = await createCase1();

    await createOrder({ docketNumber });
  }
};
