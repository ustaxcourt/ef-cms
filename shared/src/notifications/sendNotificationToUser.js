const client = require('../persistence/dynamodbClientService');

const sendNotificationToConnection = async ({
  applicationContext,
  connection,
  messageStringified,
}) => {
  const { connectionId, endpoint } = connection;

  const notificationClient = applicationContext.getNotificationClient({
    endpoint,
  });

  await notificationClient
    .postToConnection({
      ConnectionId: connectionId,
      Data: messageStringified,
    })
    .promise();
};

/**
 * sendNotificationToUser
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.message the message
 * @param {string} providers.userId the id of the user
 * @returns {Promise} upon completion of notification delivery
 */
exports.sendNotificationToUser = async ({
  applicationContext,
  message,
  userId,
}) => {
  const connections = await applicationContext
    .getPersistenceGateway()
    .getWebSocketConnectionsByUserId({
      applicationContext,
      userId,
    });

  const messageStringified = JSON.stringify(message);

  const maxRetries = 1;

  for (const connection of connections) {
    for (let i = 0; i <= maxRetries; i++) {
      try {
        await sendNotificationToConnection({
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
