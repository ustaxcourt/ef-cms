import { get } from '../../dynamodbClientService';

export const getRequestResults = async ({
  applicationContext,
  requestId,
  userId,
}: {
  applicationContext: IApplicationContext;
  requestId: string;
  userId: string;
}) =>
  await get({
    Key: {
      pk: `user|${userId}`,
      sk: `request|${requestId}`,
    },
    applicationContext,
  });
