#!/usr/bin/env -S npx ts-node --transpile-only

import {
  CreateSecretCommand,
  PutSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { parseArgsAndEnvVars } from '../helpers/parseArgsAndEnvVars';
import { getRepoName } from './createSecretsHelpers';
import {
  buildDeployEnvSecrets,
  createEnvSecretsScriptConfig,
} from './create-env-secrets.helpers';
import { makeNewPassword } from '../user/make-new-password';

const {
  adminUserEmail,
  baseDomain,
  dynamsoftProductKeys,
  emailDmarcPolicy,
  enableDynamsoft,
  enableEmail,
  enableHealthChecks,
  env,
  generateSecureDefaultAccountPassword,
  irsSuperuserEmail,
  opensearchEngineVersion,
  opensearchInstanceCount,
  opensearchInstanceType,
  opensearchVolumeSize,
  paymentPortalArn,
  paymentPortalHost,
  payGovOrigin,
  postgresOriginalUsername,
  prodAccountId,
  prodDocumentsBucket,
  rdsEngineVersion,
  rdsMaxCapacity,
  rdsMinCapacity,
  region,
  rumSampleRate,
  update,
  zendeskUserEmail,
} = parseArgsAndEnvVars(createEnvSecretsScriptConfig) as {
  adminUserEmail: string;
  baseDomain: string;
  dynamsoftProductKeys: string;
  emailDmarcPolicy: string;
  enableDynamsoft: boolean;
  enableEmail: boolean;
  enableHealthChecks: boolean;
  env: string;
  generateSecureDefaultAccountPassword: boolean;
  irsSuperuserEmail: string;
  opensearchEngineVersion: string;
  opensearchInstanceCount: number;
  opensearchInstanceType: string;
  opensearchVolumeSize: number;
  paymentPortalArn: string;
  paymentPortalHost: string;
  payGovOrigin: string;
  postgresOriginalUsername: string;
  prodAccountId: string;
  prodDocumentsBucket: string;
  rdsEngineVersion: string;
  rdsMaxCapacity: string;
  rdsMinCapacity: string;
  region: string;
  rumSampleRate: string;
  update: boolean;
  zendeskUserEmail: string;
};

if (env === 'prod') {
  console.log('Do not use in prod');
  process.exit(1);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const repoName = await getRepoName();

  const adminUserPassword = makeNewPassword();
  const defaultAccountPass = generateSecureDefaultAccountPassword
    ? makeNewPassword()
    : 'Testing1234$';
  const postgresOriginalPassword = makeNewPassword(
    ['uppercase', 'lowercase', 'numbers'],
    42,
  );

  const zendeskUserPassword = makeNewPassword();

  const envSecrets = buildDeployEnvSecrets({
    adminUserEmail,
    adminUserPassword,
    baseDomain,
    defaultAccountPass,
    dynamsoftProductKeys,
    emailDmarcPolicy,
    enableDynamsoft,
    enableEmail,
    enableHealthChecks,
    env,
    irsSuperuserEmail,
    opensearchEngineVersion,
    opensearchInstanceCount,
    opensearchInstanceType,
    opensearchVolumeSize,
    paymentPortalArn,
    paymentPortalHost,
    payGovOrigin,
    postgresOriginalPassword,
    postgresOriginalUsername,
    prodAccountId,
    prodDocumentsBucket,
    rdsEngineVersion,
    rdsMaxCapacity,
    rdsMinCapacity,
    repoName,
    rumSampleRate,
    zendeskUserEmail,
    zendeskUserPassword,
  });

  const secretsClient = new SecretsManagerClient({ region });
  if (update) {
    const putSecretValueCommand = new PutSecretValueCommand({
      SecretId: `${env}_deploy`,
      SecretString: JSON.stringify(envSecrets),
    });
    await secretsClient.send(putSecretValueCommand);
  } else {
    const createSecretCommand = new CreateSecretCommand({
      Description: `Environment variables for the ${env} environment`,
      Name: `${env}_deploy`,
      SecretString: JSON.stringify(envSecrets),
    });
    await secretsClient.send(createSecretCommand);
  }
})();
