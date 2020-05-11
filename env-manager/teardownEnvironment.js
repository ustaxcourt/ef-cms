const { deleteCognitoPools } = require('./deleteCognitoPools');
const { deleteCustomDomains } = require('./deleteCustomDomains');
const { deleteDynamoDBTables } = require('./deleteDynamoDBTables');
const { deleteS3Buckets } = require('./deleteS3Buckets');
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
  await deleteCustomDomains({ environment: environmentEast });
  await deleteCustomDomains({ environment: environmentWest });

  await deleteStacks({ environment: environmentEast });
  await deleteStacks({ environment: environmentWest });

  await deleteDynamoDBTables({ environment: environmentEast });
  await deleteDynamoDBTables({ environment: environmentWest });

  await deleteCognitoPools({ environment: environmentEast });

  await deleteS3Buckets({ environment: environmentEast });
  await deleteS3Buckets({ environment: environmentWest });
};

teardownEnvironment();
