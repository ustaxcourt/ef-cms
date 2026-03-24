import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { PutParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import {
  GetSecretValueCommand,
  PutSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { makeNewPassword } from './make-new-password';

export const loadSecrets = async ({
  region,
  secretsName,
}: {
  region: string;
  secretsName: string;
}): Promise<any> => {
  const secretsClient = new SecretsManagerClient({ region });
  const getSecretValueCommand = new GetSecretValueCommand({
    SecretId: secretsName,
  });
  const { SecretString } = await secretsClient.send(getSecretValueCommand);
  if (!SecretString) {
    throw new Error(`could not load secrets for ${secretsName}`);
  }
  const secrets = JSON.parse(SecretString);
  console.log('✅ Retrieved secrets');
  return secrets;
};

export const rotateSecrets = async ({
  ci,
  env,
  region,
  UserPoolId,
}: {
  ci: string;
  env: string;
  region: string;
  UserPoolId: string;
}): Promise<void> => {
  const secretsClient = new SecretsManagerClient({ region });
  const cognitoClient = new CognitoIdentityProvider({ region });

  console.log(`Rotating secrets for Environment: ${env}\n`);

  const isDevelopmentEnvironment = !['prod', 'test'].includes(env);

  const secrets = await loadSecrets({
    region,
    secretsName: `${env}_deploy`,
  });

  const DEFAULT_ACCOUNT_PASS = isDevelopmentEnvironment
    ? 'Testing1234$'
    : makeNewPassword();

  const USTC_ADMIN_PASS = makeNewPassword();
  const USTC_ZENDESK_PASS = makeNewPassword();

  // for local use only!
  if (!ci || !ci.length) {
    console.log({
      DEFAULT_ACCOUNT_PASS,
      USTC_ADMIN_PASS,
      USTC_ZENDESK_PASS,
    });
  }

  await cognitoClient.adminSetUserPassword({
    Password: USTC_ADMIN_PASS,
    Permanent: true,
    UserPoolId,
    Username: secrets.USTC_ADMIN_USER,
  });
  console.log('✅ USTC_ADMIN_USER Cognito Password updated');

  await cognitoClient.adminSetUserPassword({
    Password: USTC_ZENDESK_PASS,
    Permanent: true,
    UserPoolId,
    Username: secrets.USTC_ZENDESK_USER,
  });
  console.log('✅ USTC_ZENDESK_USER Cognito Password updated');

  const putSecretValueCommand = new PutSecretValueCommand({
    SecretId: `${env}_deploy`,
    SecretString: JSON.stringify({
      ...secrets,
      USTC_ZENDESK_PASS,
      DEFAULT_ACCOUNT_PASS,
      USTC_ADMIN_PASS,
    }),
  });

  await secretsClient.send(putSecretValueCommand);

  console.log('✅ Secrets updated');

  let zendeskSecrets;
  try {
    zendeskSecrets = await loadSecrets({
      region,
      secretsName: `${env}/ZendeskDawson`,
    });
  } catch (e) {
    console.log('No Zendesk secrets found');
  }

  if (zendeskSecrets) {
    const putZendeskSecretValueCommand = new PutSecretValueCommand({
      SecretId: `${env}/ZendeskDawson`,
      SecretString: JSON.stringify({
        ...zendeskSecrets,
        USTC_ZENDESK_PASS,
        USTC_ADMIN_PASS,
      }),
    });
    await secretsClient.send(putZendeskSecretValueCommand);

    console.log('✅ Zendesk secrets updated');
  }

  if (secrets.VAULT_ACCOUNT_ID?.length) {
    await invokePasswordUpdateLambdaInVaultAccount({
      env,
      newPassword: DEFAULT_ACCOUNT_PASS,
      region,
      vaultAccountId: secrets.VAULT_ACCOUNT_ID,
    });
  }
};

export const invokePasswordUpdateLambdaInVaultAccount = async ({
  env,
  newPassword,
  region,
  vaultAccountId,
}: {
  env: string;
  newPassword: string;
  region: string;
  vaultAccountId: string;
}): Promise<any> => {
  const parameters = getLambdaParameters(env);

  if (!parameters) {
    throw new Error(
      `Could not get lambda parameters for ${env} environment: unsupported environment`,
    );
  }

  const roleArn = `arn:aws:iam::${vaultAccountId}:role/vaultwarden-password-rotator`;
  const stsClient = new STSClient({ region });
  const assumeRoleCommand = new AssumeRoleCommand({
    RoleArn: roleArn,
    RoleSessionName: 'RotationSession',
  });
  const { Credentials } = await stsClient.send(assumeRoleCommand);

  if (
    !Credentials?.AccessKeyId ||
    !Credentials?.SecretAccessKey ||
    !Credentials?.SessionToken
  ) {
    throw new Error(
      'Could not get credentials for vaultwarden-password-rotator role in the vault account',
    );
  }

  const credentials = {
    accessKeyId: Credentials.AccessKeyId,
    secretAccessKey: Credentials.SecretAccessKey,
    sessionToken: Credentials.SessionToken,
  };

  const ssmClient = new SSMClient({ credentials, region });
  const putParameterCommand = new PutParameterCommand({
    Name: '/vaultwarden/dawson/test',
    Overwrite: true,
    Type: 'SecureString',
    Value: newPassword,
  });
  await ssmClient.send(putParameterCommand);

  const lambdaClient = new LambdaClient({ credentials, region });
  const invokeCommand = new InvokeCommand({
    FunctionName: `arn:aws:lambda:${vaultAccountId}:function:vaultwarden-rotate-passwords`,
    Payload: Buffer.from(JSON.stringify(parameters)),
  });
  const { Payload } = await lambdaClient.send(invokeCommand);

  if (!Payload) {
    throw new Error('Lambda invocation failed to return a payload');
  }

  return JSON.parse(Buffer.from(Payload).toString());
};

const getLambdaParameters = (
  env: string,
): { [key: string]: string } | undefined => {
  if (env === 'test') {
    return {
      collection_name: 'DAWSON Passwords',
      item_prefix: 'DAWSON (test)',
      parameter_name: '/vaultwarden/dawson/test',
      script_path: 'scripts/dawson/rotate-test-passwords.sh',
    };
  }
  console.error(
    'Did you set a VAULT_ACCOUNT_ID in an environment other than test?',
  );
};
