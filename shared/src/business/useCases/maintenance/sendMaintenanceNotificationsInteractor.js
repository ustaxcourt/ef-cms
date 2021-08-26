/**
 * sendMaintenanceNotificationsInteractor
 *
 * @param {object} applicationContext the application context
 */
exports.sendMaintenanceNotificationsInteractor = async applicationContext => {
  const allWebsocketConnections = await applicationContext
    .getPersistenceGateway()
    .getAllWebSocketConnections({ applicationContext });

  // todo: dont hardcode
  const messageStringified = JSON.stringify({
    action: 'maintenance_mode_engaged',
  });

  for (let index = 0; index < allWebsocketConnections.length; index++) {
    try {
      await applicationContext
        .getNotificationGateway()
        .sendNotificationToConnection({
          applicationContext,
          connection: allWebsocketConnections[index],
          messageStringified,
        });
    } catch (e) {
      // todo something
    }
  }
};
