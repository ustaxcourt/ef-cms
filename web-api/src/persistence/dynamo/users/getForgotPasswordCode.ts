import { ForgotPasswordRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { get } from '../../dynamodbClientService';

export const getForgotPasswordCode = async (
  applicationContext: ServerApplicationContext,
  {
    userId,
  }: {
    userId: string;
  },
): Promise<string | undefined> => {
  const result: ForgotPasswordRecord = await get({
    Key: {
      pk: `user|${userId}`,
      sk: 'forgot-password-code',
    },
    applicationContext,
  });

  return result?.code;
};
