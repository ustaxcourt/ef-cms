import { getCypressEnv } from '../../env/cypressEnvironment';
import { getUserByEmail } from '../cognito/cognito-helpers';
import { getDocumentClient } from './getDynamoCypress';

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
