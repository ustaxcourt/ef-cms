const { deleteCustomDomains } = require('./deleteCustomDomains');
const { deleteStacks } = require('./deleteStacks');
const { getApiGateway } = require('./getApiGateway');
const { getCloudFormation } = require('./getCloudFormation');

// TODO: get all values from ENV variables and validate that they exist
const environment = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  apiVersion: 'latest',
  name: 'exp',
  region: 'us-west-1',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

const teardownEnvironment = async () => {
  const cloudFormation = getCloudFormation({ environment });
  const apiGateway = getApiGateway({ environment });

  await deleteCustomDomains({ apiGateway, environment });
  await deleteStacks({ cloudFormation, environment });

  // TODO: delete Dynamo tables
  // TODO: wait for Dynamo tables to be deleted
  // TODO: empty all of the S3 buckets for the environment
};

teardownEnvironment();
