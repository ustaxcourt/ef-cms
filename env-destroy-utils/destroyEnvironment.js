const { clearS3Buckets } = require('./clearS3Buckets');
const { deleteCloudWatchLogs } = require('./deleteCloudWatchLogs');
const { deleteCustomDomains } = require('./deleteCustomDomains');
const { exec } = require('child_process');
const { readdirSync } = require('fs');

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.error(
    'Missing required AWS credentials in environment - AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY',
  );
  process.exit(1);
}

const environmentName = process.argv[2] || 'exp1';

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

const pathToTerraformTemplates = process.cwd() + '/web-api/terraform/template';

const directoriesRequiringIndexFiles = source => {
  return readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
};

const addMissingIndexFiles = () => {
  directoriesRequiringIndexFiles(pathToTerraformTemplates).map(dir =>
    exec(
      `mkdir -p "${pathToTerraformTemplates}/${dir}/dist" && touch ${pathToTerraformTemplates}/${dir}/dist/index.js`,
    ),
  );
};

const teardownEnvironment = async () => {
  addMissingIndexFiles();

  try {
    await deleteCustomDomains({ environment: environmentEast });
    await deleteCustomDomains({ environment: environmentWest });
  } catch (e) {
    console.error('Error while deleting custom domains: ', e);
  }

  try {
    await clearS3Buckets({ environment: environmentEast });
    await clearS3Buckets({ environment: environmentWest });
  } catch (e) {
    console.error('Error while clearing s3 bucket: ', e);
  }

  try {
    await deleteCloudWatchLogs({ environment: environmentEast });
    await deleteCloudWatchLogs({ environment: environmentWest });
  } catch (e) {
    console.error('Error while deleting cloudwatch logs: ', e);
  }
};

teardownEnvironment();
