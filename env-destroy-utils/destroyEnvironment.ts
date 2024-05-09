import { clearS3Buckets } from './clearS3Buckets';
import { deleteCloudWatchLogs } from './deleteCloudWatchLogs';
import { deleteCognitoPool } from './deleteCognitoPool';
import { deleteCustomDomains } from './deleteCustomDomains';
import { exec } from 'child_process';
import { readdirSync } from 'fs';
import { requireEnvVars } from '../shared/admin-tools/util';

requireEnvVars(['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY']);

const environmentName = process.argv[2] || 'exp1';

const environmentEast = {
  apiVersion: 'latest',
  name: environmentName,
  region: 'us-east-1',
};

const environmentWest = {
  apiVersion: 'latest',
  name: environmentName,
  region: 'us-west-1',
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

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
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

  try {
    await deleteCognitoPool({
      environment: environmentEast,
    });
  } catch (e) {
    console.error('Error while deleting cognito pool: ', e);
  }
})();
