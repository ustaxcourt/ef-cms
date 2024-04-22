import { queryFull } from '../../dynamodbClientService';

export type ResponseChunk = {
  chunk: string;
  index: number;
  requestId: string;
  totalNumberOfChunks: number;
};

export const getRequestResults = async ({
  applicationContext,
  requestId,
  userId,
}: {
  applicationContext: IApplicationContext;
  requestId: string;
  userId: string;
}) => {
  const results = await queryFull<ResponseChunk>({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `user|${userId}`,
    },
    KeyConditionExpression: '#pk = :pk',
    applicationContext,
  });

  return results.filter(item => item.requestId === requestId);
};
