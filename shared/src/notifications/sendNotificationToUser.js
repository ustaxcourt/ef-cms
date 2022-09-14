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
  clientConnectionId,
  message,
  userId,
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
