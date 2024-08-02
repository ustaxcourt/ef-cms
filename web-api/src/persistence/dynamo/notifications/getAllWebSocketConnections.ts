import { Connection } from '@web-api/notifications/sendNotificationToConnection';
import { queryFull } from '@web-api/persistence/dynamodbClientService';

export const getAllWebSocketConnections = ({
  applicationContext,
}: {
  applicationContext: IApplicationContext;
}): Promise<Connection[]> =>
  queryFull({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': 'connection',
    },
    IndexName: 'gsi1',
    KeyConditionExpression: '#gsi1pk = :gsi1pk',
    applicationContext,
  });
