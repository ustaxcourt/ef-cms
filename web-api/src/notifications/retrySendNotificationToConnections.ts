import { Connection } from '@web-api/notifications/sendNotificationToConnection';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const retrySendNotificationToConnections = async ({
  applicationContext,
  connections,
  deleteGoneConnections = true,
  messageStringified,
}: {
  applicationContext: ServerApplicationContext;
  connections: Connection[];
  deleteGoneConnections?: boolean;
  messageStringified: string;
}) => {
  const maxRetries = 1;

  for (let connection of connections) {
    for (let retryCount = 0; retryCount <= maxRetries; retryCount++) {
      try {
        await applicationContext
          .getNotificationGateway()
          .sendNotificationToConnection({
            applicationContext,
            connection,
            messageStringified,
          });
        break;
      } catch (err: any) {
        if (retryCount >= maxRetries && deleteGoneConnections) {
          const AWSWebSocketConnectionGone = 410;

          if (
            err?.['$metadata']?.httpStatusCode === AWSWebSocketConnectionGone
          ) {
            try {
              await applicationContext
                .getPersistenceGateway()
                .deleteUserConnection({
                  applicationContext,
                  connectionId: connection.connectionId,
                });
            } catch (error) {
              applicationContext.logger.error(
                'An error occurred while attempting to clean up the connection, it will be cleared via the dynamo TTL',
                { error },
              );
            }
          } else {
            applicationContext.logger.error(
              'An error occurred while attempting to send notification to user',
              { error: err },
            );
            throw err;
          }
        }
      }
    }
  }
};
