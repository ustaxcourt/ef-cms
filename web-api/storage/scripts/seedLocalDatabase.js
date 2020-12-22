const AWS = require('aws-sdk');
const seedEntries = require('../fixtures/seed');
const { createCase1 } = require('./cases/createCase1');
const { createOrder } = require('./cases/createOrder');
const { createUsers } = require('./createUsers');

AWS.config = new AWS.Config();
AWS.config.accessKeyId = 'noop';
AWS.config.secretAccessKey = 'noop';
AWS.config.region = 'us-east-1';

Error.stackTraceLimit = Infinity;

const client = new AWS.DynamoDB.DocumentClient({
  credentials: {
    accessKeyId: 'noop',
    secretAccessKey: 'noop',
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
  console.log('****STARTING TO SEED DATABASE');
  if (entries) {
    console.log('**** booooo');
    await putEntries(entries);
  } else {
    console.log('**** about to create users');

    await createUsers();
    console.log('**** about to put some stuff ');

    await putEntries(seedEntries);

    console.log('**** about to create case ');
    const docketNumber = await createCase1();
    console.log('**** about to create order', docketNumber);

    const docketEntryId = await createOrder({ docketNumber });

    console.log('****', docketNumber, docketEntryId);
  }
};
