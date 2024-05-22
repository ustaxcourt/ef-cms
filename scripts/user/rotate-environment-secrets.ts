import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import {
  GetSecretValueCommand,
  PutSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { requireEnvVars } from '../../shared/admin-tools/util';
import { shuffle } from 'lodash';

requireEnvVars(['COGNITO_USER_POOL', 'ENV']);

const { COGNITO_USER_POOL, ENV } = process.env;

const secretsClient = new SecretsManagerClient({ region: 'us-east-1' });
const cognitoClient = new CognitoIdentityProvider({
  region: 'us-east-1',
});

const isDevelopmentEnvironment =
  process.argv[2] && process.argv[2] === '--development';

const makeNewPassword = (): string => {
  const getRandomChar = charSet =>
    charSet.charAt(Math.floor(Math.random() * charSet.length));

  // get number between 12 and 20
  const passwordLength = 12 + Math.floor(Math.random() * 9);
  const charSets = {
    characters: '^*.()@#%&/,><:;_~=+-',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  };
  const allCharacters = Object.keys(charSets)
    .map(key => charSets[key])
    .join('');

  // get at least one random char from each of the sets
  let result = Object.keys(key => getRandomChar(charSets[key])).join('');

  // build the password
  for (let i = result.length; i <= passwordLength; i++) {
    result += getRandomChar(allCharacters);
  }

  // shuffle the password
  return shuffle(result.split('')).join('');
};

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

const rotateSecrets = async (environmentName: string): Promise<void> => {
  console.log(`Rotating secrets for Environment: ${environmentName}\n`);

  const secrets = await loadSecrets(environmentName);

  const DEFAULT_ACCOUNT_PASS = isDevelopmentEnvironment
    ? 'Testing1234$'
    : makeNewPassword();

  const USTC_ADMIN_PASS = makeNewPassword();

  // for local use only!
  if (!process.env.CI) {
    console.log({
      DEFAULT_ACCOUNT_PASS,
      USTC_ADMIN_PASS,
    });
  }

  await cognitoClient.adminSetUserPassword({
    Password: USTC_ADMIN_PASS,
    Permanent: true,
    UserPoolId: COGNITO_USER_POOL,
    Username: secrets.USTC_ADMIN_USER,
  });
  console.log('✅ USTC_ADMIN_USER Cognito Password updated');

  const putSecretValueCommand = new PutSecretValueCommand({
    SecretId: `${ENV}_deploy`,
    SecretString: JSON.stringify({
      ...secrets,
      DEFAULT_ACCOUNT_PASS,
      USTC_ADMIN_PASS,
    }),
  });
  await secretsClient.send(putSecretValueCommand);
  console.log('✅ Secrets updated');
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await rotateSecrets(ENV!);
  console.log(
    '🏁 All done. Be sure to run setup-test-users.ts or wait for the next deploy',
  );
})();
