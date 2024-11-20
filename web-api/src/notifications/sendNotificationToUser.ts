import { ServerApplicationContext } from '@web-api/applicationContext';

type MessageCompletionErrorNotification = {
  action: 'message_completion_error';
  alertError: {
    message: string;
    title: string;
  };
};

type ContactUpdateProgressNotification = {
  action: 'user_contact_update_progress' | 'admin_contact_update_progress';
  completedCases?: number;
  totalCases?: number;
};

type NotificationMessage =
  | MessageCompletionErrorNotification
  | ContactUpdateProgressNotification;

export const sendNotificationToUser = async ({
  applicationContext,
  clientConnectionId,
  message,
  userId,
}: {
  applicationContext: ServerApplicationContext;
  clientConnectionId?: string;
  message: NotificationMessage;
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
