/**
 * sendNotificationToConnection
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.connection the connection to send the message to
 * @param {string} providers.messageStringified the message
 */
exports.sendNotificationToConnection = async ({
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
