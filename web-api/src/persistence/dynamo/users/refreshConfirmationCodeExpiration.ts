import { AccountConfirmationRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { put } from '../../dynamodbClientService';

export const refreshConfirmationCodeExpiration = async (
  applicationContext: ServerApplicationContext,
  {
    confirmationCode,
    userId,
  }: {
    userId: string;
    confirmationCode: string;
  },
): Promise<void> => {
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
};
