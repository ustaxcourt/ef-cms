import { ServerApplicationContext } from '@web-api/applicationContext';
import { get } from '../../dynamodbClientService';
import { AccountConfirmationRecord } from '@web-api/persistence/dynamo/dynamoTypes';

export const getAccountConfirmationCode = async (
  applicationContext: ServerApplicationContext,
  {
    userId,
  }: {
    userId: string;
  },
): Promise<{ confirmationCode?: string }> => {
  const result: AccountConfirmationRecord = await get({
    Key: {
      pk: `user|${userId}`,
      sk: `account-confirmation-code`,
    },
    applicationContext,
  });

  return {
    confirmationCode: result?.confirmationCode,
  };
};
