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
  const maxRetries = 3;

  for (let index = 0; index < connections.length; index++) {
    for (let retryCount = 0; retryCount <= maxRetries; retryCount++) {
      try {
        await applicationContext
          .getNotificationGateway()
          .sendNotificationToConnection({
            applicationContext,
            connection: connections[index],
            messageStringified,
          });
        break;
      } catch (err) {
        applicationContext.logger.error('catching the error', {
          err,
        });

        if (retryCount >= maxRetries) {
          const AWSWebSocketConnectionGone = 410;
          if (err.statusCode === AWSWebSocketConnectionGone) {
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
