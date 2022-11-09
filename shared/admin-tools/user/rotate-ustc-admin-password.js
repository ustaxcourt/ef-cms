const { checkEnvVar } = require('../util');
const { CognitoIdentityServiceProvider, SecretsManager } = require('aws-sdk');

const NEW_PASSWORD = process.argv[2];
const { COGNITO_USER_POOL, ENV } = process.env;

checkEnvVar(
  NEW_PASSWORD,
  'You must specify a password as an argument to this call\n\n$ node rotate-ustc-admin-password.js <NEW PASSWORD>',
);
checkEnvVar(ENV, 'You must specify a ENV in your local environment');
checkEnvVar(
  COGNITO_USER_POOL,
  'You must specify a COGNITO_USER_POOL in your local environment',
);

const secretsClient = new SecretsManager({ region: 'us-east-1' });
const cognitoClient = new CognitoIdentityServiceProvider({
  region: 'us-east-1',
});

/**
 * Fetch the current secrets for the current environment
 */
const loadSecrets = async () => {
  const { SecretString } = await secretsClient
    .getSecretValue({
      SecretId: `${ENV}_deploy`,
    })
    .promise();
  const secrets = JSON.parse(SecretString);
  console.log('✅ Retrieved secrets');
  return secrets;
};

/**
 * Update the secrets for the current environment with an updated `USTC_ADMIN_PASS`
 *
 * @param {object} secrets a key value object of secrets to replace the `USTC_ADMIN_PASS`
 */
const updatePassword = async secrets => {
  await secretsClient
    .putSecretValue({
      SecretId: `${ENV}_deploy`,
      SecretString: JSON.stringify({
        ...secrets,
        USTC_ADMIN_PASS: NEW_PASSWORD,
      }),
    })
    .promise();
  console.log('✅ Secrets updated');

  await cognitoClient
    .adminSetUserPassword({
      Password: NEW_PASSWORD,
      Permanent: true,
      UserPoolId: COGNITO_USER_POOL,
      Username: secrets.USTC_ADMIN_USER,
    })
    .promise();
  console.log('✅ Password updated');
};

loadSecrets()
  .then(secrets => updatePassword(secrets))
  .then(() => {
    console.log('🏁 All done');
  });
