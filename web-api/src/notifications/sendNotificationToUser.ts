import { ServerApplicationContext } from '@web-api/applicationContext';

export const sendNotificationToUser = async ({
  applicationContext,
  clientConnectionId,
  message,
  userId,
}: {
  applicationContext: ServerApplicationContext;
  clientConnectionId?: string;
  message: any;
  userId: string;
}) => {
  let connections = await applicationContext
    .getPersistenceGateway()
    .getWebSocketConnectionsByUserId({
      applicationContext,
      userId,
    });

  if (clientConnectionId) {
    connections = connections.filter(connection => {
      return connection.clientConnectionId === clientConnectionId;
    });
  }

  const messageStringified = JSON.stringify(message);

  await applicationContext
    .getNotificationGateway()
    .retrySendNotificationToConnections({
      applicationContext,
      connections,
      messageStringified,
    });
};
