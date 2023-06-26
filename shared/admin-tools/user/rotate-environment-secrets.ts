import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { SecretsManager } from 'aws-sdk';
import { checkEnvVar } from '../util';
import { shuffle } from 'lodash';
const { COGNITO_USER_POOL, ENV } = process.env;

const secretsClient = new SecretsManager({ region: 'us-east-1' });
const cognitoClient = new CognitoIdentityProvider({
  region: 'us-east-1',
});

const isDevelopmentEnvironment =
  process.argv[2] && process.argv[2] === '--development';

checkEnvVar(ENV, 'You must specify a ENV in your local environment');
checkEnvVar(
  COGNITO_USER_POOL,
  'You must specify a COGNITO_USER_POOL in your local environment',
);

/**
 * Generate a strong password
 *
 * @param {Number} passwordLength number of characters in the password string
 * @returns {String} a randomly generated password
 */
const makeNewPassword = () => {
  const getRandomChar = charSet =>
    charSet.charAt(Math.floor(Math.random() * charSet.length));

  // get number between 12 and 20
  const passwordLength = 12 + Math.floor(Math.random() * 9);
  const charSets = {
    characters: '^*.()"@#%&/,><\':;_~`=+-',
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

/**
 * Fetch the current secrets for the specified environment
 *
 * @param {String} environmentName the name of the environment for which to lookup secrets
 * @returns {Object} the current key-value pairs that comprise of the secrets for the specified environment
 */
const loadSecrets = async environmentName => {
  const { SecretString } = await secretsClient
    .getSecretValue({
      SecretId: `${environmentName}_deploy`,
    })
    .promise();
  if (!SecretString) {
    throw new Error(`could not load secrets for ${environmentName}_deploy`);
  }
  const secrets = JSON.parse(SecretString);
  console.log('✅ Retrieved secrets');
  return secrets;
};

/**
 * Initiates the process of rotating an environments secrets
 *
 * @param {String} environmentName the name of the environment whose secrets to rotate
 */
const rotateSecrets = async environmentName => {
  console.log(`Rotating secrets for Environment: ${environmentName}\n`);

  const secrets = await loadSecrets(environmentName);

  const DEFAULT_ACCOUNT_PASS = isDevelopmentEnvironment
    ? 'Testing1234$'
    : makeNewPassword();

  const USTC_ADMIN_PASS = makeNewPassword();

  console.log({
    DEFAULT_ACCOUNT_PASS,
    USTC_ADMIN_PASS,
  });

  await cognitoClient.adminSetUserPassword({
    Password: USTC_ADMIN_PASS,
    Permanent: true,
    UserPoolId: COGNITO_USER_POOL,
    Username: secrets.USTC_ADMIN_USER,
  });
  console.log('✅ USTC_ADMIN_USER Cognito Password updated');

  await secretsClient
    .putSecretValue({
      SecretId: `${ENV}_deploy`,
      SecretString: JSON.stringify({
        ...secrets,
        DEFAULT_ACCOUNT_PASS,
        USTC_ADMIN_PASS,
      }),
    })
    .promise();
  console.log('✅ Secrets updated');
};

rotateSecrets(ENV).then(() => {
  console.log(
    '🏁 All done. Be sure to run setup-test-users.sh or wait for the next deploy',
  );
});
