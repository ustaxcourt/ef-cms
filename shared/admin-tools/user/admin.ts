import {
  AdminInitiateAuthCommandOutput,
  CognitoIdentityProvider,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  generatePassword,
  getClientId,
  getUserPoolId,
  requireEnvVars,
} from '../util';
import axios from 'axios';

const { USTC_ADMIN_PASS, USTC_ADMIN_USER } = process.env;

let cachedAuthToken;

export const enableUser = async (email: string): Promise<void> => {
  const cognito = new CognitoIdentityProvider({ region: 'us-east-1' });
  const UserPoolId = await getUserPoolId();
  await cognito.adminEnableUser({
    UserPoolId,
    Username: email.toLowerCase(),
  });
};

export const disableUser = async (email: string): Promise<void> => {
  const cognito = new CognitoIdentityProvider({ region: 'us-east-1' });
  const UserPoolId = await getUserPoolId();
  await cognito.adminDisableUser({
    UserPoolId,
    Username: email.toLowerCase(),
  });
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
