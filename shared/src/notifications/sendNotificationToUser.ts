import { UserNotificationMessage } from '@shared/notifications/UserNotificationMessage';

export const sendNotificationToUser = async ({
  applicationContext,
  clientConnectionId,
  message,
  userId,
}: {
  applicationContext: IApplicationContext;
  clientConnectionId?: string;
  message: UserNotificationMessage;
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
