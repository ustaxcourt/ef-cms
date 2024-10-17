import { getCypressEnv } from '../../env/cypressEnvironment';
import { getDocumentClient } from './getDynamoCypress';
import { getUserByEmail } from '../cognito/cognito-helpers';

export const getUserConfirmationCodeFromDynamo = async (
  userId: string,
): Promise<string> => {
  const result = await getDocumentClient().get({
    Key: { pk: `user|${userId}`, sk: 'account-confirmation-code' },
    TableName: getCypressEnv().dynamoDbTableName,
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
  const { userId } = await getUserByEmail(email);
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

export const expireUserConfirmationCode = async (
  email: string,
): Promise<null> => {
  const { userId } = await getUserByEmail(email);
  if (!userId) return null;

  await getDocumentClient()
    .delete({
      Key: { pk: `user|${userId}`, sk: 'account-confirmation-code' },
      TableName: getCypressEnv().dynamoDbTableName,
    })
    .catch(error => console.error(error)); // if no confirmation code exists do not throw error.
  return null;
};

export const toggleFeatureFlag = async ({
  flag,
  flagValue,
}: {
  flag: string;
  flagValue: any;
}): Promise<null> => {
  const dynamoClient = await getDocumentClient();
  await dynamoClient.update({
    ExpressionAttributeNames: {
      '#value': 'current',
    },
    ExpressionAttributeValues: {
      ':value': flagValue,
    },
    Key: {
      pk: flag,
      sk: flag,
    },
    TableName: getCypressEnv().dynamoDbTableName,
    UpdateExpression: 'SET #value = :value',
  });

  return null;
};

export const getFeatureFlagValue = async ({
  flag,
}: {
  flag: string;
}): Promise<boolean> => {
  const dynamoClient = await getDocumentClient();
  const result = await dynamoClient.get({
    Key: {
      pk: flag,
      sk: flag,
    },
    TableName: getCypressEnv().dynamoDbDeployTableName,
  });

  return !!result?.Item?.current;
};

export const getRawFeatureFlagValue = async ({
  flag,
}: {
  flag: string;
}): Promise<boolean> => {
  const dynamoClient = await getDocumentClient();
  const result = await dynamoClient.get({
    Key: {
      pk: flag,
      sk: flag,
    },
    TableName: getCypressEnv().dynamoDbDeployTableName,
  });

  return result?.Item?.current;
};

export const getEmailVerificationToken = async ({
  email,
}: {
  email: string;
}): Promise<string> => {
  const { userId } = await getUserByEmail(email);
  const result = await getDocumentClient().get({
    Key: {
      pk: `user|${userId}`,
      sk: `user|${userId}`,
    },
    TableName: getCypressEnv().dynamoDbTableName,
  });

  return result?.Item?.pendingEmailVerificationToken;
};
