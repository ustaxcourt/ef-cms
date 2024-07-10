import { Connection } from '@web-api/notifications/sendNotificationToConnection';
import { queryFull } from '@web-api/persistence/dynamodbClientService';

export const getWebSocketConnectionsByUserId = ({
  applicationContext,
  userId,
}: {
  applicationContext: IApplicationContext;
  userId: string;
}): Promise<Connection[]> =>
  queryFull({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `user|${userId}`,
      ':prefix': 'connection',
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    applicationContext,
  });
