import {
  batchWrite,
  getDocumentClient,
} from '../helpers/dynamo/getDynamoCypress';
import { cypressEnv } from '../helpers/env/cypressEnvironment';
import { getCognito } from '../helpers/cognito/getCognitoCypress';
import promiseRetry from 'promise-retry';
import type { DeleteRequest } from '../../web-api/src/persistence/dynamo/dynamoTypes';

export const confirmUser = async ({ email }: { email: string }) => {
  const userPoolId = await getUserPoolId();
  const clientId = await getClientId(userPoolId);

  const initAuthResponse = await getCognito().adminInitiateAuth({
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    AuthParameters: {
      PASSWORD: cypressEnv.defaultAccountPass,
      USERNAME: email,
    },
    ClientId: clientId,
    UserPoolId: userPoolId,
  });

  if (initAuthResponse.Session) {
    await getCognito().adminRespondToAuthChallenge({
      ChallengeName: 'NEW_PASSWORD_REQUIRED',
      ChallengeResponses: {
        NEW_PASSWORD: cypressEnv.defaultAccountPass,
        USERNAME: email,
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
    throw new Error(`Could not find clientIdd for userPool: ${userPoolId}`);
  }
  return clientId;
};

const getUserPoolId = async (): Promise<string> => {
  const results = await getCognito().listUserPools({
    MaxResults: 50,
  });
  const userPoolId = results?.UserPools?.find(
    pool => pool.Name === `efcms-${cypressEnv.env}`,
  )?.Id;

  if (!userPoolId) {
    throw new Error('Could not get userPoolId');
  }
  return userPoolId;
};

export const getUserTokenWithRetry = (username: string, password: string) => {
  return promiseRetry(
    retry => {
      return getUserToken(password, username).catch(retry);
    },
    {
      retries: 10,
    },
  );
};

async function getUserToken(password: string, username: string) {
  const userPoolId = await getUserPoolId();
  const clientId = await getClientId(userPoolId);

  return getCognito()
    .adminInitiateAuth({
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      AuthParameters: {
        PASSWORD: password,
        USERNAME: username,
      },
      ClientId: clientId,
      UserPoolId: userPoolId,
    })
    .catch(e => {
      throw e;
    });
}

export const getCognitoUserIdByEmail = async (
  email: string,
): Promise<string> => {
  const userPoolId = await getUserPoolId();
  const foundUser = await getCognito().adminGetUser({
    UserPoolId: userPoolId,
    Username: email,
  });

  const userId =
    foundUser.UserAttributes?.find(element => element.Name === 'custom:userId')
      ?.Value! ||
    foundUser.UserAttributes?.find(element => element.Name === 'sub')?.Value!;

  return userId;
};

const getUserConfirmationCodeFromDynamo = async (
  userId: string,
): Promise<string> => {
  const result = await getDocumentClient().get({
    Key: { pk: `user|${userId}`, sk: 'account-confirmation-code' },
    TableName: cypressEnv.dynamoDbTableName,
  });

  return result.Item!.confirmationCode;
};

export const getNewAccountVerificationCode = async ({
  email,
}: {
  email: string;
}): Promise<{
  userId: string | undefined;
  confirmationCode: string | undefined;
}> => {
  const userId = await getCognitoUserIdByEmail(email);
  if (!userId)
    return {
      confirmationCode: undefined,
      userId: undefined,
    };

  const confirmationCode = await getUserConfirmationCodeFromDynamo(userId);

  return {
    confirmationCode,
    userId,
  };
};

const deleteAccount = async (
  user: { userId: string; email: string },
  userPoolId: string,
): Promise<void> => {
  const params = {
    UserPoolId: userPoolId,
    Username: user.email,
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
    TableName: cypressEnv.dynamoDbTableName,
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
    const userId =
      user.Attributes?.find(element => element.Name === 'custom:userId')
        ?.Value! ||
      user.Attributes?.find(element => element.Name === 'sub')?.Value!;
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

export const expireUserConfirmationCode = async (
  email: string,
): Promise<null> => {
  const userId = await getCognitoUserIdByEmail(email);
  if (!userId) return null;

  await getDocumentClient()
    .delete({
      Key: { pk: `user|${userId}`, sk: 'account-confirmation-code' },
      TableName: cypressEnv.dynamoDbTableName,
    })
    .catch(error => console.error(error)); // if no confirmation code exists do not throw error.
  return null;
};

export const getForgotPasswordCode = async ({
  email,
}: {
  email: string;
}): Promise<string> => {
  const userId = await getCognitoUserIdByEmail(email);

  const result = await getDocumentClient().get({
    Key: {
      pk: `user|${userId}`,
      sk: 'forgot-password-code',
    },
    TableName: cypressEnv.dynamoDbTableName,
  });

  return result?.Item?.code;
};

export const expireForgotPasswordCode = async ({
  email,
}: {
  email: string;
}): Promise<null> => {
  const userId = await getCognitoUserIdByEmail(email);

  try {
    await getDocumentClient().delete({
      Key: { pk: `user|${userId}`, sk: 'forgot-password-code' },
      TableName: cypressEnv.dynamoDbTableName,
    });
  } catch (e) {
    // if no confirmation code exists do not throw error.
  }

  return null;
};

export const getEmailVerificationToken = async ({
  email,
}: {
  email: string;
}): Promise<string> => {
  const userId = await getCognitoUserIdByEmail(email);
  const result = await getDocumentClient().get({
    Key: {
      pk: `user|${userId}`,
      sk: `user|${userId}`,
    },
    TableName: cypressEnv.dynamoDbTableName,
  });

  return result?.Item?.pendingEmailVerificationToken;
};
