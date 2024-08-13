import {
  type ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';
import { ServerApplicationContext } from '@web-api/applicationContext';

export type Connection = {
  clientConnectionId: string;
  connectionId: string;
  endpoint: string;
  pk: string;
  sk: string;
  userId: string;
};

export const sendNotificationToConnection = async ({
  applicationContext,
  connection,
  messageStringified,
}: {
  applicationContext: ServerApplicationContext;
  connection: Connection;
  messageStringified: string;
}) => {
  const { connectionId, endpoint } = connection;

  const notificationClient: ApiGatewayManagementApiClient =
    applicationContext.getNotificationClient({
      endpoint,
    });
  const postToConnectionCommand = new PostToConnectionCommand({
    ConnectionId: connectionId,
    Data: messageStringified,
  });

  await notificationClient.send(postToConnectionCommand);
};
