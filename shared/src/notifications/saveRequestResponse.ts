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
  return await put({
    Item: {
      pk: `user|${userId}`,
      response: JSON.stringify(response),
      sk: `request|${requestId}`,
    },
    applicationContext,
  });
};
