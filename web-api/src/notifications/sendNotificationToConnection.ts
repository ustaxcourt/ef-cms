import {
  type ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { ConnectionKysely } from '@web-api/persistence/postgres/connections/schema';

export const sendNotificationToConnection = async ({
  applicationContext,
  connection,
  messageStringified,
}: {
  applicationContext: ServerApplicationContext;
  connection: ConnectionKysely;
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
