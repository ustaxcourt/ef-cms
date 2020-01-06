const AWS = require('aws-sdk');
const createApplicationContext = require('./src/applicationContext');
const seedEntries = require('./storage/fixtures/seed');
//const { getUserFromAuthHeader } = require('./src/middleware/apiGatewayHelper');
const {
  createUserRecords,
} = require('../shared/src/persistence/dynamo/users/createUser.js');

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
  const user = {
    role: 'admin',
  };
  const applicationContext = createApplicationContext(user);

  const result = await createUserRecords({
    applicationContext,
    user: {
      email: 'docketclerk',
      name: 'Test Docketclerk',
      role: 'docketclerk',
      section: 'docket',
    },
    userId: '2805d1ab-18d0-43ec-bafb-654e83405416',
  });

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
