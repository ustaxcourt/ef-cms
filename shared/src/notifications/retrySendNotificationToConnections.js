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
    `0 retrySendNotificationToConnections connections!!! ${connections}`,
  );

  const maxRetries = 1;

  for (const connection of connections) {
    for (let i = 0; i <= maxRetries; i++) {
      try {
        applicationContext.logger.error(
          `1 sendNotificationToConnection!!! messageStringified ${messageStringified}`,
        );
        await applicationContext
          .getNotificationGateway()
          .sendNotificationToConnection({
            applicationContext,
            connection,
            messageStringified,
          });
        break;
      } catch (err) {
        if (i >= maxRetries) {
          const AWSWebSocketConnectionGone = 410;
          if (err.statusCode === AWSWebSocketConnectionGone) {
            applicationContext.logger.error(
              '410 error, going to delete connection!!!',
              connection.pk,
            );
            await client.delete({
              applicationContext,
              key: {
                pk: connection.pk,
                sk: connection.sk,
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
