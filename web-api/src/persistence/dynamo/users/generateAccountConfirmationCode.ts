import { AccountConfirmationRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { put } from '../../dynamodbClientService';

export const generateAccountConfirmationCode = async (
  applicationContext: ServerApplicationContext,
  {
    userId,
  }: {
    userId: string;
  },
): Promise<{ confirmationCode: string }> => {
  const confirmationCode = applicationContext.getUniqueId();
  const expireInOneDay = Date.now() / 1000 + 24 * 60 * 60;
  const accountConfirmationRecord: AccountConfirmationRecord = {
    confirmationCode,
    pk: `user|${userId}`,
    sk: 'account-confirmation-code',
    ttl: expireInOneDay,
    userId,
  };

  await put({
    Item: accountConfirmationRecord,
    applicationContext,
  });

  return {
    confirmationCode,
  };
};
