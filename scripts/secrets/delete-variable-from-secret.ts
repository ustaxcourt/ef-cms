#!/usr/bin/env -S npx ts-node --transpile-only

import {
  GetSecretValueCommand,
  PutSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { alphabetizeObjectProps } from './createSecretsHelpers';

const scriptConfig: ScriptConfig = {
  description:
    'delete-variable-from-secret - Updates the [env]_deploy secrets and removes the provided key',
  environment: {
    env: 'ENV',
    region: 'REGION',
  },
  parameters: {
    key: {
      position: 0,
      required: true,
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { env, key, region } = parseArgsAndEnvVars(scriptConfig) as {
  env: string;
  key: string;
  region: string;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const secretsClient = new SecretsManagerClient({ region });
  const SecretId = `${env}_deploy`;
  const getSecretValueCommand = new GetSecretValueCommand({ SecretId });
  const { SecretString } = await secretsClient.send(getSecretValueCommand);
  if (!SecretString) {
    throw new Error(`Secret ${SecretId} not found`);
  }
  const trimmedKey = key.trim().replace(' ', '_').toUpperCase();
  const secrets = JSON.parse(SecretString);
  delete secrets[trimmedKey];
  const putSecretValueCommand = new PutSecretValueCommand({
    SecretId,
    SecretString: JSON.stringify(alphabetizeObjectProps(secrets)),
  });
  await secretsClient.send(putSecretValueCommand);
  console.log(`Updated secret ${SecretId} to remove "${key}"`);
})();
