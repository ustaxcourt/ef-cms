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
