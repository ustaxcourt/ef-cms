import { ServerApplicationContext } from '@web-api/applicationContext';
import { put } from '../../dynamodbClientService';
import { AccountConfirmationRecord } from '@web-api/persistence/dynamo/dynamoTypes';

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
    pk: `user|${userId}`,
    sk: `account-confirmation-code`,
    confirmationCode,
    userId,
    ttl: expireInOneDay,
  };

  await put({
    Item: accountConfirmationRecord,
    applicationContext,
  });

  return {
    confirmationCode,
  };
};
