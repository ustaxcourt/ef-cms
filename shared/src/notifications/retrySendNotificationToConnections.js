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
  const maxRetries = 1;

  for (const connection of connections) {
    for (let i = 0; i <= maxRetries; i++) {
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
        if (i >= maxRetries) {
          if (err.statusCode === 410) {
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
