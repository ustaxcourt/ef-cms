import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { put } from '@web-api/persistence/dynamodbClientService';

export const saveRequestResponse = async ({
  applicationContext,
  requestId,
  response,
  userId,
}: {
  applicationContext: IApplicationContext;
  requestId: string;
  response: any;
  userId: string;
}) => {
  const nowUnix = Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS));
  return await put({
    Item: {
      pk: `user|${userId}`,
      response: JSON.stringify(response),
      sk: `request|${requestId}`,
      ttl: 16 * 60 + nowUnix,
    },
    applicationContext,
  });
};
