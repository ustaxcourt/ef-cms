import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { put } from '@web-api/persistence/dynamodbClientService';

export const saveRequestResponse = async ({
  applicationContext,
  chunk,
  index,
  requestId,
  totalNumberOfChunks,
  userId,
}: {
  applicationContext: IApplicationContext;
  requestId: string;
  chunk: string;
  index: number;
  totalNumberOfChunks: number;
  userId: string;
}) => {
  const nowUnix = Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS));
  return await put({
    Item: {
      chunk,
      index,
      pk: `user|${userId}`,
      requestId,
      sk: `request|${requestId}-${index}`,
      totalNumberOfChunks,
      ttl: 16 * 60 + nowUnix,
    },
    applicationContext,
  });
};
