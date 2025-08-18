#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import fs from 'fs';
import path from 'path';
import { runCommand } from '../helpers/runCommand';
import { execSync } from 'child_process';

const scriptConfig: ScriptConfig = {
  description:
    'pull-and-tag - Pulls the docker image with the given destination tag ' +
    'from the source ECR and tags it to the destination ECR',
  environment: {
    region: 'REGION',
    targetAccountId: 'AWS_ACCOUNT_ID',
    targetEnv: 'ENV',
  },
  parameters: {
    destinationTag: {
      long: 'destination-tag',
      required: false,
      short: 't',
      type: 'string',
    },
    srcEnv: {
      long: 'source-env',
      required: true,
      short: 'e',
      type: 'string',
    },
    srcAccountId: {
      long: 'source-account-id',
      required: false,
      short: 'a',
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};

const {
  destinationTag,
  region,
  srcAccountId,
  srcEnv,
  targetAccountId,
  targetEnv,
} = parseArgsAndEnvVars(scriptConfig) as {
  destinationTag: string;
  region: string;
  srcAccountId: string;
  srcEnv: string;
  targetAccountId: string;
  targetEnv: string;
};

const readDefaultOrg = ({ efCmsRoot }: { efCmsRoot: string }): string => {
  let defaultOrg = 'ustc';
  const defaultsFile = `${efCmsRoot}/scripts/env/defaults`;
  if (fs.existsSync(defaultsFile)) {
    const defaultsFileData = fs.readFileSync(defaultsFile, 'utf8');
    const configuredDefaultOrg = defaultsFileData
      .split('\n')
      .filter(line => line.includes('DEFAULT_ORG'))[0]
      .split("'")[1];
    if (configuredDefaultOrg) {
      defaultOrg = configuredDefaultOrg;
    }
  }
  return defaultOrg;
};

const readSourceAccountId = ({
  sourceEnvConfigFile,
}: {
  sourceEnvConfigFile: string;
}): string | undefined => {
  if (!fs.existsSync(sourceEnvConfigFile)) {
    return;
  }
  const sourceEnvConfig = fs.readFileSync(sourceEnvConfigFile, 'utf8');
  return sourceEnvConfig
    .split('\n')
    .filter(line => line.includes('AWS_ACCOUNT_ID'))[0]
    .split("'")[1];
};

const readDockerContainerVersion = ({
  efCmsRoot,
}: {
  efCmsRoot: string;
}): string | undefined => {
  const circleCiConfigFile = `${efCmsRoot}/.circleci/config.yml`;
  if (!fs.existsSync(circleCiConfigFile)) {
    return;
  }
  const circleCiConfig = fs.readFileSync(circleCiConfigFile, 'utf8');
  return circleCiConfig
    .split('\n')
    .filter(line => line.includes('efcms-docker-image: &'))[0]
    .split(':')[2];
};

async function app() {
  const efCmsRoot = path.resolve(__dirname, '../..');
  const defaultOrg = readDefaultOrg({ efCmsRoot });

  const sourceEnv = `${defaultOrg}-${srcEnv}`;
  const sourceEnvConfigFile = `${efCmsRoot}/scripts/env/environments/${sourceEnv}.env`;
  if (!fs.existsSync(sourceEnvConfigFile)) {
    throw new Error(
      `Environment configuration file does not exist: ${sourceEnvConfigFile}`,
    );
  }

  const sourceAccountId =
    srcAccountId || readSourceAccountId({ sourceEnvConfigFile });
  if (!sourceAccountId) {
    throw new Error(
      `Unable to determine the source account ID from ${sourceEnvConfigFile}`,
    );
  }

  const tag = destinationTag || readDockerContainerVersion({ efCmsRoot });

  console.log(`Retrieving temporary AWS credentials for ${srcEnv}...`);
  const envSwitcherCommand = `. scripts/env/set-env.zsh ${sourceEnv} --quiet`;
  const echoInfoCommand = `echo "{
    \\"AWS_ACCESS_KEY_ID\\": \\"$AWS_ACCESS_KEY_ID\\",
    \\"AWS_ACCOUNT_ID\\": \\"$AWS_ACCOUNT_ID\\",
    \\"AWS_REGION\\": \\"$AWS_REGION\\",
    \\"AWS_SECRET_ACCESS_KEY\\": \\"$AWS_SECRET_ACCESS_KEY\\",
    \\"AWS_SESSION_TOKEN\\": \\"$AWS_SESSION_TOKEN\\"
  }"`;
  const sourceAwsAccessKeyIdString = execSync(
    `${envSwitcherCommand}; ${echoInfoCommand}`,
  )
    .toString()
    .trim();

  const sourceAwsAccessKeyInfo = JSON.parse(sourceAwsAccessKeyIdString) as {
    AWS_ACCESS_KEY_ID: string;
    AWS_ACCOUNT_ID: string;
    AWS_REGION: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_SESSION_TOKEN: string;
  };

  const sourceEcrLoginPassword = await runCommand(
    'aws',
    ['ecr', 'get-login-password', '--region', region],
    sourceAwsAccessKeyInfo,
  );

  const sourceDockerLoginOutput = await runCommand('docker', [
    'login',
    '-u',
    'AWS',
    '--password',
    sourceEcrLoginPassword,
    `${sourceAccountId}.dkr.ecr.${region}.amazonaws.com`,
  ]);
  console.log(`Logging in to the ${srcEnv} ECR...\n`, sourceDockerLoginOutput);

  const sourceDockerPullOutput = await runCommand('docker', [
    'pull',
    `${sourceAccountId}.dkr.ecr.${region}.amazonaws.com/ef-cms-${region}:${tag}`,
  ]);
  console.log(
    `Pulling docker image ${tag} from the ${srcEnv} ECR...`,
    sourceDockerPullOutput,
  );

  const localDockerTagOuput = await runCommand('docker', [
    'tag',
    `${sourceAccountId}.dkr.ecr.${region}.amazonaws.com/ef-cms-${region}:${tag}`,
    `ef-cms-${region}:${tag}`,
  ]);
  console.log(`Tagging docker image ${tag} locally...`, localDockerTagOuput);

  const targetDockerTagOutput = await runCommand('docker', [
    'tag',
    `ef-cms-${region}:${tag}`,
    `${targetAccountId}.dkr.ecr.${region}.amazonaws.com/ef-cms-${region}:${tag}`,
  ]);
  console.log(
    `Re-tagging docker image ${tag} so it can be pushed to the ${targetEnv} ECR...`,
    targetDockerTagOutput,
  );

  const targetEcrLoginPassword = await runCommand('aws', [
    'ecr',
    'get-login-password',
    '--region',
    region,
  ]);
  const targetDockerLoginOutput = await runCommand('docker', [
    'login',
    '-u',
    'AWS',
    '--password',
    targetEcrLoginPassword,
    `${targetAccountId}.dkr.ecr.${region}.amazonaws.com`,
  ]);
  console.log(`Logging in to the ${targetEnv} ECR...`, targetDockerLoginOutput);

  const targetDockerPushOutput = await runCommand('docker', [
    'push',
    '--platform',
    'linux/amd64',
    `${targetAccountId}.dkr.ecr.${region}.amazonaws.com/ef-cms-${region}:${tag}`,
  ]);
  console.log(
    `Pushing docker image ${tag} to the ${targetEnv} ECR...`,
    targetDockerPushOutput,
  );

  console.log(
    `Successfully pulled ${tag} from ${srcEnv} and tagged it to ${targetEnv}`,
  );
}

void app();
