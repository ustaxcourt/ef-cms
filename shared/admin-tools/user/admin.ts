import {
  AdminInitiateAuthCommandOutput,
  CognitoIdentityProvider,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  Practitioner,
  RawPractitioner,
} from '@shared/business/entities/Practitioner';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { RawUser, User } from '@shared/business/entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { getClientId, getUserPoolId, requireEnvVars } from '../util';

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

export async function createOrUpdateUser(
  applicationContext: ServerApplicationContext,
  {
    password,
    user,
  }: {
    user: RawUser | RawPractitioner;
    password: string;
  },
): Promise<{ userId: string }> {
  const userPoolId =
    user.role === ROLES.irsSuperuser
      ? process.env.USER_POOL_IRS_ID
      : process.env.USER_POOL_ID;

  const userExists = await applicationContext
    .getUserGateway()
    .getUserByEmail(applicationContext, {
      email: user.email!,
      poolId: userPoolId,
    });

  const userId = userExists?.userId || applicationContext.getUniqueId();

  let rawUser: RawUser | RawPractitioner;
  if (
    user.role === ROLES.privatePractitioner ||
    user.role === ROLES.irsPractitioner ||
    user.role === ROLES.inactivePractitioner
  ) {
    rawUser = new Practitioner({
      ...user,
      userId,
    })
      .validate()
      .toRawObject();
  } else {
    rawUser = new User({ ...user, userId }).validate().toRawObject();
  }

  await applicationContext.getPersistenceGateway().createUserRecords({
    applicationContext,
    user: rawUser,
    userId: rawUser.userId,
  });

  if (userExists) {
    await applicationContext.getUserGateway().updateUser(applicationContext, {
      attributesToUpdate: {
        role: rawUser.role,
      },
      email: rawUser.email!,
      poolId: userPoolId,
    });
  } else {
    await applicationContext.getUserGateway().createUser(applicationContext, {
      attributesToUpdate: {
        email: rawUser.email,
        name: rawUser.name,
        role: rawUser.role,
        userId,
      },
      email: rawUser.email!,
      poolId: userPoolId,
    });
  }

  if (user.role === ROLES.legacyJudge) {
    await applicationContext.getUserGateway().disableUser(applicationContext, {
      email: user.email!,
    });
  }

  await applicationContext.getCognito().adminSetUserPassword({
    Password: password,
    Permanent: true,
    UserPoolId: userPoolId,
    Username: user.email?.toLowerCase(),
  });

  return { userId };
}
