const { getApiGateway } = require('./getApiGateway');
const { getCloudFormation } = require('./getCloudFormation');
const { getCustomDomains } = require('./getCustomDomains');
const { getStacks } = require('./getStacks');

// TODO: get all values from ENV variables and validate that they exist
const environment = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  apiVersion: 'latest',
  name: 'exp',
  region: 'us-east-1',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

const teardownEnvironment = async () => {
  const cloudFormation = getCloudFormation({ environment });
  const apiGateway = getApiGateway({ environment });
  const stacks = await getStacks({ cloudFormation, environment });
  const customDomains = await getCustomDomains({ apiGateway, environment });
  console.log(stacks);
  console.log(customDomains);
  // TODO: delete custom domains
  // TODO: wait for domains to be deleted
  // TODO: delete stacks
  // TODO: wait for stacks to be deleted
  // TODO: delete Dynamo tables
  // TODO: wait for Dynamo tables to be deleted
  // TODO: empty all of the S3 buckets for the environment
};

teardownEnvironment();
