#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import fs from 'fs';
import path from 'path';
import { runCommand } from '../helpers/runCommand';

const scriptConfig: ScriptConfig = {
  description:
    'pull-and-tag - Pulls the docker image with the given destination tag ' +
    'from the source ECR and tags it to the destination ECR',
  environment: {
    region: 'REGION',
    targetAccountId: 'TARGET_ACCOUNT_ID',
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

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const efCmsRoot = path.resolve('__dirname', '../..');
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

  // TODO - figure out how to get a login password for the source ECR without switching to the source account
  const sourceEcrLoginPassword = '';
  await runCommand('docker', [
    'login',
    '--password',
    sourceEcrLoginPassword,
    `${sourceAccountId}.dkr.ecr.${region}.amazonaws.com`,
  ]);

  await runCommand('docker', [
    'pull',
    `${sourceAccountId}.dkr.ecr.${region}.amazonaws.com/ef-cms-${region}:${tag}`,
  ]);

  await runCommand('docker', [
    'tag',
    `${sourceAccountId}.dkr.ecr.${region}.amazonaws.com/ef-cms-${region}:${tag}`,
    `ef-cms-${region}:${tag}`,
  ]);

  await runCommand('docker', [
    'tag',
    `ef-cms-${region}:${tag}`,
    `${targetAccountId}.dkr.ecr.${region}.amazonaws.com/ef-cms-${region}:${tag}`,
  ]);

  const targetEcrLoginPassword = await runCommand('aws', [
    'ecr',
    'get-login-password',
    '--region',
    region,
  ]);
  await runCommand('docker', [
    'login',
    '--password',
    targetEcrLoginPassword,
    `${targetAccountId}.dkr.ecr.${region}.amazonaws.com`,
  ]);

  await runCommand('docker', [
    'push',
    `${targetAccountId}.dkr.ecr.${region}.amazonaws.com/ef-cms-${region}:${tag}`,
  ]);

  console.log(
    `Successfully pulled ${tag} from ${sourceEnv} and tagged it to ${targetEnv}`,
  );
})();
