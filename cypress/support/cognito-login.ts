import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import AWS from 'aws-sdk';
import promiseRetry from 'promise-retry';

const awsRegion = 'us-east-1';
AWS.config = new AWS.Config();

AWS.config.credentials = {
  accessKeyId: process.env.CYPRESS_AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.CYPRESS_AWS_SECRET_ACCESS_KEY!,
  sessionToken: process.env.CYPRESS_AWS_SESSION_TOKEN,
};
AWS.config.region = awsRegion;

const { ENV } = process.env;
const DEFAULT_ACCOUNT_PASS = process.env.CYPRESS_DEFAULT_ACCOUNT_PASS;

const cognito = new CognitoIdentityProvider({
  region: 'us-east-1',
});

const dynamoDB = new AWS.DynamoDB();

export const confirmUser = async ({ email }: { email: string }) => {
  const userPoolId = await getUserPoolId();
  const clientId = await getClientId(userPoolId);

  const initAuthResponse = await cognito.adminInitiateAuth({
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    AuthParameters: {
      PASSWORD: DEFAULT_ACCOUNT_PASS,
      USERNAME: email,
    },
    ClientId: clientId,
    UserPoolId: userPoolId,
  });

  if (initAuthResponse.Session) {
    await cognito.adminRespondToAuthChallenge({
      ChallengeName: 'NEW_PASSWORD_REQUIRED',
      ChallengeResponses: {
        NEW_PASSWORD: DEFAULT_ACCOUNT_PASS,
        USERNAME: email,
      },
      ClientId: clientId,
      Session: initAuthResponse.Session,
      UserPoolId: userPoolId,
    });
  }

  return null;
};

const getClientId = async (userPoolId: string) => {
  const results = await cognito.listUserPoolClients({
    MaxResults: 60,
    UserPoolId: userPoolId,
  });
  const clientId = results.UserPoolClients[0].ClientId;
  return clientId;
};

const getUserPoolId = async () => {
  const results = await cognito.listUserPools({
    MaxResults: 50,
  });
  const userPoolId = results.UserPools.find(
    pool => pool.Name === `efcms-${ENV}`,
  ).Id;
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

  return cognito
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
      console.log('I am error: ', e);
      throw e;
    });
}

export const getNewAccountVerificationCode = async ({
  email,
}: {
  email: string;
}): Promise<{
  userId: string | undefined;
  confirmationCode: string | undefined;
}> => {
  const userPoolId = await getUserPoolId();
  const users = await cognito.listUsers({
    AttributesToGet: ['custom:userId'],
    Filter: `email = "${email}"`,
    UserPoolId: userPoolId,
  });

  const userId = users.Users?.[0].Attributes?.find(
    element => element.Name === 'custom:userId',
  )?.Value;

  const primaryKeyValues = {
    pk: { S: `user|${userId}` },
    sk: { S: 'account-confirmation-code' },
  };

  const itemsAlpha = await dynamoDB
    .getItem({
      Key: primaryKeyValues,
      TableName: 'efcms-exp3-alpha',
    })
    .promise();

  const itemsBeta = await dynamoDB
    .getItem({
      Key: primaryKeyValues,
      TableName: 'efcms-exp3-beta',
    })
    .promise();

  return {
    confirmationCode:
      itemsAlpha.Item?.confirmationCode?.S ||
      itemsBeta.Item?.confirmationCode?.S,
    userId,
  };
};

const deleteAccountByUsername = async (
  username: string,
  userPoolId: string,
): Promise<void> => {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
  };
  await cognito.adminDeleteUser(params);
};

const getAllCypressTestAccounts = async (
  userPoolId: string,
): Promise<string[]> => {
  const params = {
    Filter: 'username ^= "cypress_test_account"',
    UserPoolId: userPoolId,
  };

  const result = await cognito.listUsers(params);
  if (!result) return [];
  if (!result.Users) return [];
  const users = result.Users.map(user => user.Username).filter(
    username => !!username,
  ) as string[];
  return users;
};

export const deleteAllCypressTestAccounts = async () => {
  const userPoolId = await getUserPoolId();
  if (!userPoolId) return;
  const accounts = await getAllCypressTestAccounts(userPoolId);
  await Promise.all(
    accounts.map((username: string) =>
      deleteAccountByUsername(username, userPoolId),
    ),
  );
};
