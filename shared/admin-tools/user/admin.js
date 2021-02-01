const { CognitoIdentityServiceProvider } = require('aws-sdk');
const { ENV, USTC_ADMIN_PASS, USTC_ADMIN_USER } = process.env;
const { checkEnvVar, getClientId, getUserPoolId } = require('../util');

/**
 */
const activate = async () => {
  const cognito = new CognitoIdentityServiceProvider({ region: 'us-east-1' });
  const UserPoolId = await getUserPoolId();

  await cognito
    .adminEnableUser({
      UserPoolId,
      Username: USTC_ADMIN_USER,
    })
    .promise();
};

const deactivate = async () => {
  const cognito = new CognitoIdentityServiceProvider({ region: 'us-east-1' });
  const UserPoolId = await getUserPoolId();

  const result = await cognito
    .adminDisableUser({
      UserPoolId,
      Username: USTC_ADMIN_USER,
    })
    .promise();
  console.log(result);
};

/**
 * Get an authentication token for the admin account
 *
 * @returns {String} token to use for authentication
 */
const getAuthToken = async () => {
  checkEnvVar(
    USTC_ADMIN_PASS,
    'You must have USTC_ADMIN_PASS set in your local environment',
  );
  checkEnvVar(
    USTC_ADMIN_USER,
    'You must have USTC_ADMIN_USER set in your local environment',
  );
  checkEnvVar(ENV, 'You must have ENV set in your local environment');

  const cognito = new CognitoIdentityServiceProvider({ region: 'us-east-1' });
  const UserPoolId = await getUserPoolId();
  const ClientId = await getClientId(UserPoolId);

  try {
    const response = await cognito
      .adminInitiateAuth({
        AuthFlow: 'ADMIN_NO_SRP_AUTH',
        AuthParameters: {
          PASSWORD: USTC_ADMIN_PASS,
          USERNAME: USTC_ADMIN_USER,
        },
        ClientId,
        UserPoolId,
      })
      .promise();
    if (
      !response ||
      typeof response.AuthenticationResult.IdToken === 'undefined'
    ) {
      throw 'Could not get token!';
    }
    return response['AuthenticationResult']['IdToken'];
  } catch (err) {
    console.error(err);
    throw err;
  }
};

exports.getAuthToken = getAuthToken;
exports.activate = activate;
exports.deactivate = deactivate;
