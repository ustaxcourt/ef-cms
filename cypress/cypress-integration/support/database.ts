import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { getCognitoUserIdByEmail } from '../../support/cognito-login';

const DYNAMODB_TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'efcms-local';

const dynamoClient = new DynamoDBClient({
  credentials: {
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
  },
  endpoint: 'http://localhost:8000',
  region: 'us-east-1',
});
const documentClient = DynamoDBDocument.from(dynamoClient, {
  marshallOptions: { removeUndefinedValues: true },
});

export const getEmailVerificationToken = async ({
  userId,
}: {
  userId: string;
}) => {
  const result = await documentClient.get({
    Key: {
      pk: `user|${userId}`,
      sk: `user|${userId}`,
    },
    TableName: 'efcms-local',
  });

  return result?.Item?.pendingEmailVerificationToken;
};

export const getForgotPasswordCode = async ({
  email,
}: {
  email: string;
}): Promise<string> => {
  const userId = await getCognitoUserIdByEmail(email);

  const result = await documentClient.get({
    Key: {
      pk: `user|${userId}`,
      sk: 'forgot-password-code',
    },
    TableName: DYNAMODB_TABLE_NAME,
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
    await documentClient.delete({
      Key: { pk: `user|${userId}`, sk: 'forgot-password-code' },
      TableName: DYNAMODB_TABLE_NAME,
    });
  } catch (e) {
    // if no confirmation code exists do not throw error.
  }

  return null;
};

export const setAllowedTerminalIpAddresses = async ipAddresses => {
  return await documentClient.put({
    Item: {
      ips: ipAddresses,
      pk: 'allowed-terminal-ips',
      sk: 'allowed-terminal-ips',
    },
    TableName: 'efcms-local',
  });
};
