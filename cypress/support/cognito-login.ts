import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb';
// import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import promiseRetry from 'promise-retry';

const awsRegion = 'us-east-1';
const stage = process.env.CYPRESS_STAGE || 'local';
console.log('&&&&&&&&&&&&&&&&&&&&&&&&&: ', stage);
const cognitoEndpoint =
  stage === 'local' ? 'http://localhost:9229/' : undefined;
const accessKeyId = process.env.CYPRESS_AWS_ACCESS_KEY_ID || 'S3RVER';
const secretAccessKey = process.env.CYPRESS_AWS_ACCESS_KEY_ID || 'S3RVER';

const cognito = new CognitoIdentityProvider({
  credentials: { accessKeyId, secretAccessKey },
  endpoint: cognitoEndpoint,
  region: awsRegion,
});

// const dynamoDB = new DynamoDBClient({
//   credentials: {
//     accessKeyId: process.env.CYPRESS_AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.CYPRESS_AWS_SECRET_ACCESS_KEY!,
//     sessionToken: process.env.CYPRESS_AWS_SESSION_TOKEN,
//   },
//   region: awsRegion,
// });
const dynamoEndpoint = stage === 'local' ? 'http://localhost:8000' : undefined;
const dynamoDB = new DynamoDBClient({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  endpoint: dynamoEndpoint,
  region: 'us-east-1',
});
// const documentClient = DynamoDBDocument.from(dynamoDB, {
//   marshallOptions: { removeUndefinedValues: true },
// });
const DEFAULT_ACCOUNT_PASS = process.env.CYPRESS_DEFAULT_ACCOUNT_PASS;
const DYNAMODB_TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'efcms-local';

export const confirmUser = async ({ email }: { email: string }) => {
  const userPoolId = (await getUserPoolId()) || '';
  const clientId = await getClientId(userPoolId);

  const initAuthResponse = await cognito.adminInitiateAuth({
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    AuthParameters: {
      PASSWORD: DEFAULT_ACCOUNT_PASS || '',
      USERNAME: email,
    },
    ClientId: clientId,
    UserPoolId: userPoolId,
  });

  if (initAuthResponse.Session) {
    await cognito.adminRespondToAuthChallenge({
      ChallengeName: 'NEW_PASSWORD_REQUIRED',
      ChallengeResponses: {
        NEW_PASSWORD: DEFAULT_ACCOUNT_PASS || '',
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
  const clientId = (results?.UserPoolClients || [])[0].ClientId;
  return clientId;
};

const getUserPoolId = async () => {
  const results = await cognito.listUserPools({
    MaxResults: 50,
  });
  console.log('^^^^^^^^ getUserPoolId: ', JSON.stringify(results, null, 2));
  const userPoolId = (results?.UserPools || []).find(
    pool => pool.Name === `efcms-${stage}`,
  )?.Id;
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
  const userPoolId = (await getUserPoolId()) || '';
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

const getCognitoUserIdByEmail = async (email: string) => {
  const userPoolId = await getUserPoolId();
  console.log('getCognitoUserIdByEmail args: ', { email, userPoolId });
  const users = await cognito.listUsers({
    AttributesToGet: ['custom:userId'],
    Filter: `email = "${email}"`,
    UserPoolId: userPoolId,
  });
  console.log(
    'getCognitoUserIdByEmail users: ',
    JSON.stringify({ users }, null, 2),
  );

  return users.Users?.[0].Attributes?.find(
    element => element.Name === 'custom:userId',
  )?.Value;
};

const getUserConfirmationCodeFromDynamo = async (userId: string) => {
  const primaryKeyValues = {
    pk: { S: `user|${userId}` },
    sk: { S: 'account-confirmation-code' },
  };

  const command = new GetItemCommand({
    Key: primaryKeyValues,
    TableName: DYNAMODB_TABLE_NAME,
  });

  const items = await dynamoDB.send(command);

  return items.Item?.confirmationCode?.S;
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
    Filter: 'email ^= "cypress_test_account"',
    UserPoolId: userPoolId,
  };

  const result = await cognito.listUsers(params);
  if (!result || !result.Users) return [];

  const usernames = result.Users.map(user => user.Username).filter(
    Boolean,
  ) as string[];

  return usernames;
};

export const deleteAllCypressTestAccounts = async () => {
  const userPoolId = await getUserPoolId();
  if (!userPoolId) return null;
  const accounts = await getAllCypressTestAccounts(userPoolId);
  await Promise.all(
    accounts.map((username: string) =>
      deleteAccountByUsername(username, userPoolId),
    ),
  );
  return null;
};

export const expireUserConfirmationCode = async (email: string) => {
  const userId = await getCognitoUserIdByEmail(email);
  if (!userId) return null;

  const pk = { S: `user|${userId}` };
  const sk = { S: 'account-confirmation-code' };

  const deleteItemParams: DeleteItemCommand = new DeleteItemCommand({
    Key: {
      pk,
      sk,
    },
    TableName: DYNAMODB_TABLE_NAME,
  });

  await dynamoDB.send(deleteItemParams).catch(error => console.error(error));

  return null;
};
