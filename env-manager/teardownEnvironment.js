const { deleteCustomDomains } = require('./deleteCustomDomains');
const { deleteDynamoDBTables } = require('./deleteDynamoDBTables');
const { deleteStacks } = require('./deleteStacks');

// TODO: get all values from ENV variables and validate that they exist
const environmentEast = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  apiVersion: 'latest',
  name: 'exp',
  region: 'us-east-1',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

const environmentWest = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  apiVersion: 'latest',
  name: 'exp',
  region: 'us-west-1',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

const teardownEnvironment = async () => {
  await deleteCustomDomains({ environmentEast });
  await deleteCustomDomains({ environmentWest });

  await deleteStacks({ environmentEast });
  await deleteStacks({ environmentWest });

  await deleteDynamoDBTables({ environmentEast });
  await deleteDynamoDBTables({ environmentWest });
};

teardownEnvironment();
