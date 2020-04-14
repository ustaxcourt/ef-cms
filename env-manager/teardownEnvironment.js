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
};

teardownEnvironment();
