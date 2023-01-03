// eslint-disable-next-line spellcheck/spell-checker

/**
 * retrySendNotificationToConnections
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.connections the connections
 * @param {string} providers.messageStringified the messageStringified
 */
export const retrySendNotificationToConnections = async ({
  applicationContext,
  connections,
  deleteGoneConnections = true,
  messageStringified,
}: {
  applicationContext: IApplicationContext;
  connections: TConnection[];
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
      } catch (err) {
        if (retryCount >= maxRetries && deleteGoneConnections) {
          const AWSWebSocketConnectionGone = 410;
          if (err.statusCode === AWSWebSocketConnectionGone) {
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
