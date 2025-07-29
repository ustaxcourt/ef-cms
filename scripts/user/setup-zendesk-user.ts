#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { makeNewPassword } from 'scripts/user/make-new-password';
import {
  GetSecretValueCommand,
  PutSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';

const scriptConfig: ScriptConfig = {
  description: 'sets up zendesk user for automations integration',
  environment: {
    UserPoolId: 'COGNITO_USER_POOL',
    env: 'ENV',
  },
  requireActiveAwsSession: true,
};
const { env, UserPoolId } = parseArgsAndEnvVars(scriptConfig) as {
  [k: string]: string;
};

const cognitoClient = new CognitoIdentityProvider({
  region: 'us-east-1',
});
const secretsClient = new SecretsManagerClient({ region: 'us-east-1' });

const loadSecrets = async (environmentName: string): Promise<any> => {
  const getSecretValueCommand = new GetSecretValueCommand({
    SecretId: `${environmentName}_deploy`,
  });
  const { SecretString } = await secretsClient.send(getSecretValueCommand);
  if (!SecretString) {
    throw new Error(`could not load secrets for ${environmentName}_deploy`);
  }
  const secrets = JSON.parse(SecretString);
  console.log('✅ Retrieved secrets');
  return secrets;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const secrets = await loadSecrets(env);

  const USTC_ZENDESK_USER = 'ustczendesk@dawson.ustaxcourt.gov';
  // NEED USER ID?????
  await cognitoClient.adminCreateUser({
    UserAttributes: [
      {
        Name: 'email_verified',
        Value: 'true',
      },
      {
        Name: 'email',
        Value: USTC_ZENDESK_USER,
      },
      {
        Name: 'custom:role',
        Value: 'zendesk',
      },
      {
        Name: 'name',
        Value: 'zendesk',
      },
    ],
    UserPoolId,
    Username: USTC_ZENDESK_USER,
  });

  const USTC_ZENDESK_PASS = makeNewPassword();

  await cognitoClient.adminSetUserPassword({
    Password: USTC_ZENDESK_PASS,
    Permanent: true,
    UserPoolId,
    Username: USTC_ZENDESK_USER,
  });

  const putSecretValueCommand = new PutSecretValueCommand({
    SecretId: `${env}_deploy`,
    SecretString: JSON.stringify({
      ...secrets,
      USTC_ZENDESK_USER,
      USTC_ZENDESK_PASS,
    }),
  });

  await secretsClient.send(putSecretValueCommand);

  console.log('Done!');
})();
