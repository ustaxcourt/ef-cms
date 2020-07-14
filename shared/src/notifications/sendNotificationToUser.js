const client = require('../persistence/dynamodbClientService');

const sendNotificationToConnection = async ({
  applicationContext,
  connection,
  messageStringified,
}) => {
  let result;
  try {
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
  } catch (err) {
    if (err.statusCode === 410) {
      await client.delete({
        applicationContext,
        key: {
          pk: connection.pk,
          sk: connection.sk,
        },
      });
    } else {
      // what if error doesn't conform to the above?
      throw err;
    }
  }
  return result;
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

  for (const connection of connections) {
    await sendNotificationToConnection({
      applicationContext,
      connection,
      messageStringified,
    });
  }
};
