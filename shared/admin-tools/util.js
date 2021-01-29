const { CognitoIdentityServiceProvider, DynamoDB } = require('aws-sdk');

const { ENV } = process.env;
/**
 * This function makes it easy to lookup the current version so that we can perform searches against it
 *
 * @param {String} environmentName The environment we are going to lookup the current color
 * @returns {String} The current version of the application
 */
exports.getVersion = async environmentName => {
  const dynamodb = new DynamoDB({ region: 'us-east-1' });
  const result = await dynamodb
    .getItem({
      Key: {
        pk: {
          S: 'source-table-version',
        },
        sk: {
          S: 'source-table-version',
        },
      },
      TableName: `efcms-deploy-${environmentName}`,
    })
    .promise();

  if (!result || !result.Item) {
    throw 'Could not determine the current version';
  }
  return result.Item.current.S;
};

/**
 * Simple function to help ensure that a value is truthy before allowing the process to continue
 *
 * @param {String} value The value to ensure is truthy
 * @param {String} message The message to relay if the value is not truthy
 */
exports.checkEnvVar = (value, message) => {
  if (!value) {
    console.log(message);
    process.exit(1);
  }
};

/**
 * Get an authentication token for the admin account
 * @returns {String} token to use for authentication
 */
exports.getAuthToken = async () => {
  const { USTC_ADMIN_PASS, USTC_ADMIN_USER } = process.env;
  const cognito = new CognitoIdentityServiceProvider({ region: 'us-east-1' });
  const UserPoolId = await getUserPoolId();
  const ClientId = await getClientId(UserPoolId);

  try {
    const response = await cognito.adminInitiateAuth({
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      AuthParameters: {
        PASSWORD: USTC_ADMIN_PASS,
        USERNAME: USTC_ADMIN_USER,
      },
      ClientId,
      UserPoolId,
    });
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

/**
 * Ascertain the Cognito User Pool based on the current environment
 *
 * @returns {String} The unique identifier of the Cognito User Pool
 */
const getUserPoolId = async () => {
  const cognito = new CognitoIdentityServiceProvider({ region: 'us-east-1' });
  const results = await cognito
    .listUserPools({
      MaxResults: 50,
    })
    .promise();
  const userPoolId = results.UserPools.find(
    pool => pool.Name === `efcms-${ENV}`,
  ).Id;
  return userPoolId;
};

/**
 * Ascertain the Client ID for the Cognito User Pool we use to authenticate users
 *
 * @param {String} userPoolId The unique identifier of the Cognito User Pool
 * @returns {String} The unique identifier of the Cognito Client ID
 */
const getClientId = async userPoolId => {
  const cognito = new CognitoIdentityServiceProvider({ region: 'us-east-1' });
  const results = await cognito
    .listUserPoolClients({
      MaxResults: 60,
      UserPoolId: userPoolId,
    })
    .promise();
  const clientId = results.UserPoolClients[0].ClientId;
  return clientId;
};
