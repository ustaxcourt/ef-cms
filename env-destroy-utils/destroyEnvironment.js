const { deleteCustomDomains } = require('./deleteCustomDomains');
const { deleteS3Buckets } = require('./deleteS3Buckets');
const { deleteStacks } = require('./deleteStacks');
const { exec } = require('child_process');
const { readdirSync } = require('fs');

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
  // todo remove these method calls once the envs that use these resources are dealt with
  try {
    await Promise.all([
      deleteCustomDomains({ environment: environmentEast }),
      deleteCustomDomains({ environment: environmentWest }),
    ]);
  } catch (e) {
    console.error('Error while deleting custom domains: ', e);
  }

  // todo remove these method calls once the envs that use these resources are dealt with
  try {
    await Promise.all([
      deleteStacks({ environment: environmentEast }),
      deleteStacks({ environment: environmentWest }),
    ]);
  } catch (e) {
    console.error('Error while deleting stacks: ', e);
  }

  // todo remove these method calls once the envs that use these resources are dealt with
  try {
    await Promise.all([
      deleteS3Buckets({ environment: environmentEast }),
      deleteS3Buckets({ environment: environmentWest }),
    ]);
  } catch (e) {
    console.error('Error while deleting s3 bucket: ', e);
  }

  const webClientTerraformDestroy = exec(
    `cd web-client/terraform/main && ../bin/environment-destroy.sh ${environmentName}`,
  );

  webClientTerraformDestroy.stdout.on('data', function (data) {
    console.log('Web Client Terraform stdout: ', data.toString());
  });

  webClientTerraformDestroy.stderr.on('data', function (data) {
    console.log('Web Client Terraform stderr: ', data.toString());
  });

  webClientTerraformDestroy.on('exit', function (code) {
    console.log(
      'Web Client Terraform child process exited with code ',
      code.toString(),
    );
  });

  const webApiTerraformDestroy = exec(
    `cd web-api/terraform/main && ../bin/environment-destroy.sh ${environmentName}`,
  );

  webApiTerraformDestroy.stdout.on('data', function (data) {
    console.log('Web API Terraform stdout: ', data.toString());
  });

  webApiTerraformDestroy.stderr.on('data', function (data) {
    console.log('Web API Terraform stderr: ', data.toString());
  });

  webApiTerraformDestroy.on('exit', function (code) {
    console.log(
      'Web Client API child process exited with code ',
      code.toString(),
    );
  });
};

teardownEnvironment();
