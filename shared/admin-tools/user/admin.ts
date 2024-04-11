import {
  AdminInitiateAuthCommandOutput,
  CognitoIdentityProvider,
  UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  generatePassword,
  getClientId,
  getUserPoolId,
  requireEnvVars,
} from '../util';
import axios from 'axios';

const { ENV, USTC_ADMIN_PASS, USTC_ADMIN_USER } = process.env;

let cachedAuthToken;

export const enableUser = async email => {
  const cognito = new CognitoIdentityProvider({ region: 'us-east-1' });
  const UserPoolId = await getUserPoolId();
  await cognito.adminEnableUser({
    UserPoolId,
    Username: email,
  });
};

export const disableUser = async email => {
  const cognito = new CognitoIdentityProvider({ region: 'us-east-1' });
  const UserPoolId = await getUserPoolId();
  await cognito.adminDisableUser({
    UserPoolId,
    Username: email,
  });
};

export const activateAdminAccount = async () => {
  const cognito = new CognitoIdentityProvider({ region: 'us-east-1' });
  const UserPoolId = await getUserPoolId();

  try {
    await cognito.adminEnableUser({
      UserPoolId,
      Username: USTC_ADMIN_USER,
    });
  } catch (err) {
    const { code }: any = err;
    switch (code) {
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

export const deactivateAdminAccount = async () => {
  const cognito = new CognitoIdentityProvider({ region: 'us-east-1' });
  const UserPoolId = await getUserPoolId();

  await cognito.adminDisableUser({
    UserPoolId,
    Username: USTC_ADMIN_USER,
  });
};

/**
 * This verifies that the USTC admin user is disabled in Cognito
 */
export const verifyAdminUserDisabled = async ({ attempt }) => {
  const cognito = new CognitoIdentityProvider({ region: 'us-east-1' });
  const UserPoolId = await getUserPoolId();

  try {
    let result = await cognito.adminGetUser({
      UserPoolId,
      Username: USTC_ADMIN_USER,
    });

    if (result && result.Enabled === false) {
      console.log('USTC Admin user is disabled in verifyAdminUserDisabled.');
      return;
    } else {
      console.error(
        'USTC Admin user is NOT disabled as expected. Disabling...',
      );

      const maxRetries = 3;
      await cognito.adminDisableUser({
        UserPoolId,
        Username: USTC_ADMIN_USER,
      });

      if (attempt < maxRetries) {
        attempt++;
        await verifyAdminUserDisabled({ attempt });
      } else {
        console.error(
          'Unable to verify that the USTC Admin user is disabled - max retries reached. Exiting...',
        );
        process.exit(1);
      }
    }
  } catch (err) {
    const { code, message }: any = err;
    if (code !== 'UserNotFoundException') {
      console.log('err', err);
      console.error(message);
      process.exit(1);
    }
  }
};

export const getAuthToken = async () => {
  if (cachedAuthToken) {
    return cachedAuthToken;
  }
  requireEnvVars(['ENV', 'USTC_ADMIN_PASS', 'USTC_ADMIN_USER']);

  const cognito: CognitoIdentityProvider = new CognitoIdentityProvider({
    region: 'us-east-1',
  });
  const UserPoolId = await getUserPoolId();
  if (!UserPoolId) {
    throw new Error('No UserPoolId found');
  }
  const ClientId = await getClientId(UserPoolId);

  try {
    const response: AdminInitiateAuthCommandOutput =
      await cognito.adminInitiateAuth({
        AuthFlow: 'ADMIN_NO_SRP_AUTH',
        AuthParameters: {
          PASSWORD: USTC_ADMIN_PASS!,
          USERNAME: USTC_ADMIN_USER!,
        },
        ClientId,
        UserPoolId,
      });
    if (
      !response ||
      typeof response.AuthenticationResult!.IdToken === 'undefined'
    ) {
      throw 'Could not get token!';
    }
    cachedAuthToken = response['AuthenticationResult']!['IdToken'];
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
  const cognito = new CognitoIdentityProvider({ region: 'us-east-1' });
  const UserPoolId = await getUserPoolId();
  await cognito.adminSetUserPassword({
    Password,
    Permanent,
    UserPoolId,
    Username,
  });
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
export const createDawsonUser = async ({
  deployingColorUrl,
  setPermanentPassword = false,
  user,
}: {
  deployingColorUrl: string;
  setPermanentPassword?: boolean;
  user: {
    password?: string;
    email: string;
  };
}) => {
  user.password = user.password || generatePassword(12);
  const authToken = await getAuthToken();
  const headers = {
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-type': 'application/json',
    },
  };

  try {
    await axios.post(deployingColorUrl, user, headers);

    if (setPermanentPassword) {
      await setPassword({
        Password: user.password,
        Permanent: true,
        Username: user.email,
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error(`Unable to create Dawson user. Cause: ${err.cause}`);
  }
};

export const createAdminAccount = async () => {
  // does the user exist?
  const cognito = new CognitoIdentityProvider({ region: 'us-east-1' });
  const UserPoolId = await getUserPoolId();
  try {
    let result = await cognito.adminGetUser({
      UserPoolId,
      Username: USTC_ADMIN_USER,
    });
    if (result) {
      console.log('Admin user already exists - not going to try to create it');
      return;
    }
  } catch (err) {
    const { code }: any = err;
    if (code === undefined && !(err instanceof UserNotFoundException)) {
      console.error(err);
      process.exit(1);
    }

    if (code && code !== 'UserNotFoundException') {
      console.error(err);
      process.exit(1);
    }
  }
  await cognito.adminCreateUser({
    MessageAction: 'SUPPRESS',
    UserAttributes: [
      {
        Name: 'email',
        Value: USTC_ADMIN_USER,
      },
      {
        Name: 'email_verified',
        Value: 'true',
      },
      {
        Name: 'custom:role',
        Value: 'admin',
      },
    ],
    UserPoolId,
    Username: USTC_ADMIN_USER,
  });

  await cognito.adminSetUserPassword({
    Password: USTC_ADMIN_PASS,
    Permanent: true,
    UserPoolId,
    Username: USTC_ADMIN_USER,
  });
  return true;
};
