import {
  AuthFlowType,
  ChallengeNameType,
} from '@aws-sdk/client-cognito-identity-provider';
import { DeleteRequest } from '@web-api/persistence/dynamo/dynamoTypes';
import { TOTP } from 'totp-generator';
import { batchWrite, getDocumentClient } from '../dynamo/getDynamoCypress';
import { getCognito } from './getCognitoCypress';
import { getCypressEnv } from '../../env/cypressEnvironment';

export const DEFAULT_FORGOT_PASSWORD_CODE = '385030';

export const confirmUser = async ({ email }: { email: string }) => {
  const userPoolId = await getUserPoolId();
  const clientId = await getClientId(userPoolId);

  const initAuthResponse = await getCognito().adminInitiateAuth({
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    AuthParameters: {
      PASSWORD: getCypressEnv().defaultAccountPass,
      USERNAME: email.toLowerCase(),
    },
    ClientId: clientId,
    UserPoolId: userPoolId,
  });

  if (initAuthResponse.Session) {
    await getCognito().adminRespondToAuthChallenge({
      ChallengeName: 'NEW_PASSWORD_REQUIRED',
      ChallengeResponses: {
        NEW_PASSWORD: getCypressEnv().defaultAccountPass,
        USERNAME: email.toLowerCase(),
      },
      ClientId: clientId,
      Session: initAuthResponse.Session,
      UserPoolId: userPoolId,
    });
  }

  return null;
};

const getClientId = async (userPoolId: string): Promise<string> => {
  const results = await getCognito().listUserPoolClients({
    MaxResults: 60,
    UserPoolId: userPoolId,
  });
  const clientId = results?.UserPoolClients?.[0].ClientId;
  if (!clientId) {
    throw new Error(`Could not find clientId for userPool: ${userPoolId}`);
  }
  return clientId;
};

export const getCognitoUserIdByEmail = async (
  email: string,
): Promise<string> => {
  const userPoolId = await getUserPoolId();
  const foundUser = await getCognito().adminGetUser({
    UserPoolId: userPoolId,
    Username: email.toLowerCase(),
  });

  const userId = foundUser.UserAttributes?.find(
    element => element.Name === 'custom:userId',
  )?.Value!;

  return userId;
};

const getUserPoolId = async (isIrsEnv = false): Promise<string> => {
  const results = await getCognito().listUserPools({
    MaxResults: 50,
  });
  const poolName = isIrsEnv
    ? `efcms-irs-${getCypressEnv().env}`
    : `efcms-${getCypressEnv().env}`;

  const userPoolId = results?.UserPools?.find(
    pool => pool.Name === poolName,
  )?.Id;

  if (!userPoolId) {
    throw new Error('Could not get userPoolId');
  }
  return userPoolId;
};

export const createAccount = async ({
  isIrsEnv,
  password,
  role,
  userName,
}: {
  userName: string;
  password: string;
  role: string;
  isIrsEnv: boolean;
}): Promise<null> => {
  const userPoolId = await getUserPoolId(isIrsEnv);
  await getCognito().adminCreateUser({
    TemporaryPassword: password,
    UserAttributes: [
      {
        Name: 'custom:role',
        Value: role,
      },
      {
        Name: 'email',
        Value: userName.toLowerCase(),
      },
      {
        Name: 'email_verified',
        Value: 'true',
      },
    ],
    UserPoolId: userPoolId,
    Username: userName.toLowerCase(),
  });
  await getCognito().adminSetUserPassword({
    Password: password,
    Permanent: true,
    UserPoolId: userPoolId,
    Username: userName.toLowerCase(),
  });
  return null;
};

const deleteAccount = async (
  user: { userId: string; email: string },
  userPoolId: string,
): Promise<void> => {
  const params = {
    UserPoolId: userPoolId,
    Username: user.email.toLowerCase(),
  };
  await getCognito().adminDeleteUser(params);

  const userRecords = await getDocumentClient().query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `user|${user.userId}`,
    },
    KeyConditionExpression: '#pk = :pk ',
    TableName: getCypressEnv().dynamoDbTableName,
  });

  const userRecord = userRecords.Items?.find(record => {
    return record.sk === `user|${user.userId}`;
  });

  const deleteRequests: DeleteRequest[] = [];
  if (userRecord) {
    deleteRequests.push({
      DeleteRequest: {
        Key: {
          pk: `user-email|${userRecord.email}`,
          sk: `user|${user.userId}`,
        },
      },
    });

    deleteRequests.push({
      DeleteRequest: {
        Key: {
          pk: `privatePractitioner|${userRecord.barNumber}`,
          sk: `user|${user.userId}`,
        },
      },
    });
    deleteRequests.push({
      DeleteRequest: {
        Key: {
          pk: `privatePractitioner|${userRecord.name}`,
          sk: `user|${user.userId}`,
        },
      },
    });

    userRecords.Items?.map(record =>
      deleteRequests.push({
        DeleteRequest: {
          Key: {
            pk: record.pk,
            sk: record.sk,
          },
        },
      }),
    );

    await batchWrite(deleteRequests);
  }
};

const getAllCypressTestAccounts = async (
  userPoolId: string,
): Promise<{ email: string; userId: string }[]> => {
  const params = {
    Filter: 'email ^= "cypress_test_account"',
    UserPoolId: userPoolId,
  };

  const result = await getCognito().listUsers(params);
  if (!result || !result.Users) return [];

  const usernames = result.Users.map(user => {
    const userId = user.Attributes?.find(
      element => element.Name === 'custom:userId',
    )?.Value!;
    const email = user.Attributes?.find(
      element => element.Name === 'email',
    )?.Value!;

    return {
      email,
      userId,
    };
  });

  return usernames;
};

export const deleteAllCypressTestAccounts = async (): Promise<null> => {
  const userPoolId = await getUserPoolId();
  if (!userPoolId) return null;
  const accounts = await getAllCypressTestAccounts(userPoolId);
  await Promise.all(accounts.map(user => deleteAccount(user, userPoolId)));
  return null;
};

export const deleteAllIrsCypressTestAccounts = async (): Promise<null> => {
  const irsUserPoolId = await getUserPoolId(true);
  if (!irsUserPoolId) return null;
  const irsAccounts = await getAllCypressTestAccounts(irsUserPoolId);
  await Promise.all(
    irsAccounts.map(user => deleteAccount(user, irsUserPoolId)),
  );
  return null;
};

export async function getIrsBearerToken({
  password,
  userName,
}: {
  password: string;
  userName: string;
}): Promise<string> {
  const userPoolId = await getUserPoolId(true);
  const clientId = await getClientId(userPoolId);
  const initiateAuthResult = await getCognito().adminInitiateAuth({
    AuthFlow: AuthFlowType.ADMIN_USER_PASSWORD_AUTH,
    AuthParameters: {
      PASSWORD: password,
      USERNAME: userName.toLowerCase(),
    },
    ClientId: clientId,
    UserPoolId: userPoolId,
  });
  const associateResult = await getCognito().associateSoftwareToken({
    Session: initiateAuthResult.Session,
  });

  if (!associateResult.SecretCode) {
    throw new Error('Could not generate Secret Code');
  }
  const { otp } = TOTP.generate(associateResult.SecretCode);
  const verifyTokenResult = await getCognito().verifySoftwareToken({
    Session: associateResult.Session,
    UserCode: otp,
  });
  const challengeResponse = await getCognito().respondToAuthChallenge({
    ChallengeName: ChallengeNameType.MFA_SETUP,
    ChallengeResponses: {
      USERNAME: userName.toLowerCase(),
    },
    ClientId: clientId,
    Session: verifyTokenResult.Session,
  });
  if (!challengeResponse.AuthenticationResult?.IdToken) {
    throw new Error(`Failed to generate token for user: ${userName}`);
  }
  return challengeResponse.AuthenticationResult?.IdToken;
}
