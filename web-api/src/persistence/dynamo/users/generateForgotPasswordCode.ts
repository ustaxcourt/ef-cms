import { ForgotPasswordRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { put } from '../../dynamodbClientService';

export const generateForgotPasswordCode = async (
  applicationContext: ServerApplicationContext,
  {
    userId,
  }: {
    userId: string;
  },
): Promise<{ code: string }> => {
  const code = applicationContext.getUniqueId();
  const expireInOneDay = Date.now() / 1000 + 24 * 60 * 60;
  const forgotPasswordRecord: ForgotPasswordRecord = {
    code,
    pk: `user|${userId}`,
    sk: 'forgot-password-code',
    ttl: expireInOneDay,
    userId,
  };

  await put({
    Item: forgotPasswordRecord,
    applicationContext,
  });

  return {
    code,
  };
};
