const client = require('../persistence/dynamodbClientService');

// eslint-disable-next-line spellcheck/spell-checker
/**
 * retrySendNotificationToConnections
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.connections the connections
 * @param {string} providers.messageStringified the messageStringified
 */
exports.retrySendNotificationToConnections = async ({
  applicationContext,
  connections,
  messageStringified,
}) => {
  applicationContext.logger.error(
    `01 retrySendNotificationToConnections conn.length!!! ${connections.length}`,
  );
  connections.forEach(c => {
    applicationContext.logger.error(
      `0 retrySendNotificationToConnections connections!!! ${c}`,
    );
  });

  const maxRetries = 1;

  for (let index = 0; index < connections.length; index++) {
    // for (const connection of connections) {
    for (let retryCount = 0; retryCount <= maxRetries; retryCount++) {
      try {
        applicationContext.logger.error(
          `1 sendNotificationToConnection!!! messageStringified ${messageStringified}`,
        );
        await applicationContext
          .getNotificationGateway()
          .sendNotificationToConnection({
            applicationContext,
            connection: connections[index],
            messageStringified,
          });
        break;
      } catch (err) {
        if (retryCount >= maxRetries) {
          const AWSWebSocketConnectionGone = 410;
          if (err.statusCode === AWSWebSocketConnectionGone) {
            applicationContext.logger.error(
              `410 error, going to delete connection!!! ${connections[index]}`,
            );
            await client.delete({
              applicationContext,
              key: {
                pk: connections[index].pk,
                sk: connections[index].sk,
              },
            });
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
