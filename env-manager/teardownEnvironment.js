const { deleteCustomDomains } = require('./deleteCustomDomains');
const { deleteStacks } = require('./deleteStacks');

const environmentName = 'eric';

const environmentEast = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  apiVersion: 'latest',
  name: environmentName,
  region: 'us-east-1',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

const environmentWest = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  apiVersion: 'latest',
  name: environmentName,
  region: 'us-west-1',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

const teardownEnvironment = async () => {
  await deleteCustomDomains({ environment: environmentEast });
  await deleteCustomDomains({ environment: environmentWest });

  await deleteStacks({ environment: environmentEast });
  await deleteStacks({ environment: environmentWest });
};

teardownEnvironment();
