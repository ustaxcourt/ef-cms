import { AccountConfirmationRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
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

  const now = Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS));

  if (!result || (result.ttl && result.ttl < now)) {
    return undefined;
  }

  return result.confirmationCode;
};
