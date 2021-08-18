const axios = require('axios');
const { CognitoIdentityServiceProvider } = require('aws-sdk');
const { EFCMS_DOMAIN, ENV, USTC_ADMIN_PASS, USTC_ADMIN_USER } = process.env;
const {
  checkEnvVar,
  generatePassword,
  getClientId,
  getUserPoolId,
} = require('../util');

let cachedAuthToken;

const enableUser = async email => {
  const cognito = new CognitoIdentityServiceProvider({ region: 'us-east-1' });
  const UserPoolId = await getUserPoolId();
  await cognito
    .adminEnableUser({
      UserPoolId,
      Username: email,
    })
    .promise();
};

const disableUser = async email => {
  const cognito = new CognitoIdentityServiceProvider({ region: 'us-east-1' });
  const UserPoolId = await getUserPoolId();
  await cognito
    .adminDisableUser({
      UserPoolId,
      Username: email,
    })
    .promise();
};

/**
 * This activates the admin user in Cognito so we can perform actions
 */
const activateAdminAccount = async () => {
  const cognito = new CognitoIdentityServiceProvider({ region: 'us-east-1' });
  const UserPoolId = await getUserPoolId();

  try {
    await cognito
      .adminEnableUser({
        UserPoolId,
        Username: USTC_ADMIN_USER,
      })
      .promise();
  } catch (err) {
    switch (err.code) {
      case 'UserNotFoundException':
        console.error(
          `ERROR: Admin User: ${USTC_ADMIN_USER} does not exist for ${ENV}`,
        );
        break;
      default:
        console.error(err);
        break;
    }
    process.exit(1);
  }
};

/**
 * This disables the admin in Cognito for security
 */
const deactivateAdminAccount = async () => {
  const cognito = new CognitoIdentityServiceProvider({ region: 'us-east-1' });
  const UserPoolId = await getUserPoolId();

  await cognito
    .adminDisableUser({
      UserPoolId,
      Username: USTC_ADMIN_USER,
    })
    .promise();
};

/**
 * Get an authentication token for the admin account
 *
 * @returns {String} token to use for authentication
 */
const getAuthToken = async () => {
  if (cachedAuthToken) {
    return cachedAuthToken;
  }
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
    cachedAuthToken = response['AuthenticationResult']['IdToken'];
    return cachedAuthToken;
  } catch (err) {
    console.error(`ERROR: ${err}`);
    process.exit();
  }
};

/**
 *
 * @param {Object} providers The providers object
 * @param {String} providers.Password The password for the user
 * @param {Boolean} providers.Permanent Whether or not the password is permanent (true) or temporary (false)
 * @param {String} providers.Username The username (email) of the Cognito user we are updating
 */
const setPassword = async ({ Password, Permanent = false, Username }) => {
  const cognito = new CognitoIdentityServiceProvider({ region: 'us-east-1' });
  const UserPoolId = await getUserPoolId();
  await cognito
    .adminSetUserPassword({
      Password,
      Permanent,
      UserPoolId,
      Username,
    })
    .promise();
};

/**
 * Make API call to DAWSON to create the user in the system
 *
 * @param {Object} providers The providers object
 * @param {String} providers.email The user's email
 * @param {String} providers.name The user's full name
 * @param {String} providers.role The user's role
 * @param {String} providers.section The user's section at the Court
 */
const createDawsonUser = async ({
  setPermanentPassword = false,
  urlOverride,
  user,
}) => {
  checkEnvVar(
    EFCMS_DOMAIN,
    'Please Ensure EFCMS_DOMAIN is set in your local environment',
  );
  user.password = user.password || generatePassword(12);
  const authToken = await getAuthToken();
  const headers = {
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-type': 'application/json',
    },
  };

  const url = urlOverride ?? `https://api.${EFCMS_DOMAIN}/users`;
  try {
    await axios.post(url, user, headers);

    if (setPermanentPassword) {
      await setPassword({
        Password: user.password,
        Permanent: true,
        Username: user.email,
      });
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const createAdminAccount = async () => {
  // does the user exist?
  const cognito = new CognitoIdentityServiceProvider({ region: 'us-east-1' });
  const UserPoolId = await getUserPoolId();
  try {
    let result = await cognito
      .adminGetUser({
        UserPoolId,
        Username: USTC_ADMIN_USER,
      })
      .promise();
    if (result) {
      console.log('Admin user already exists - not going to try to create it');
      return;
    }
  } catch (err) {
    if (err.code !== 'UserNotFoundException') {
      console.error(err);
      process.exit(1);
    }
  }
  await cognito
    .adminCreateUser({
      MessageAction: 'SUPPRESS',
      UserAttributes: [
        {
          Name: 'email',
          Value: USTC_ADMIN_USER,
        },
        {
          Name: 'email_verified',
          Value: 'True',
        },
        {
          Name: 'custom:role',
          Value: 'admin',
        },
      ],
      UserPoolId,
      Username: USTC_ADMIN_USER,
    })
    .promise();

  await cognito
    .adminSetUserPassword({
      Password: USTC_ADMIN_PASS,
      Permanent: true,
      UserPoolId,
      Username: USTC_ADMIN_USER,
    })
    .promise();
  return true;
};

exports.createAdminAccount = createAdminAccount;
exports.getAuthToken = getAuthToken;
exports.activateAdminAccount = activateAdminAccount;
exports.deactivateAdminAccount = deactivateAdminAccount;
exports.createDawsonUser = createDawsonUser;
exports.enableUser = enableUser;
exports.disableUser = disableUser;
