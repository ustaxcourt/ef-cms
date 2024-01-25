import { AccountConfirmationRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { get } from '../../dynamodbClientService';

export const getAccountConfirmationCode = async (
  applicationContext: ServerApplicationContext,
  {
    userId,
  }: {
    userId: string;
  },
): Promise<string | undefined> => {
  const result: AccountConfirmationRecord = await get({
    Key: {
      pk: `user|${userId}`,
      sk: 'account-confirmation-code',
    },
    applicationContext,
  });

  return result?.confirmationCode;
};
