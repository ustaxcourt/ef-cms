const AWS = require('aws-sdk');
const seedEntries = require('./storage/fixtures/seed');

const args = process.argv.slice(2);

const client = new AWS.DynamoDB.DocumentClient({
  credentials: {
    accessKeyId: 'noop',
    secretAccessKey: 'noop',
  },
  endpoint: 'http://localhost:8000',
  region: 'us-east-1',
});

const main = async () => {
  let entries;
  if (args[0]) {
    // eslint-disable-next-line security/detect-non-literal-require
    entries = require(args[0]);
  } else {
    entries = seedEntries;
  }
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

main();
