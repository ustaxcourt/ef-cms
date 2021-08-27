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

  await applicationContext
    .getNotificationGateway()
    .retrySendNotificationToConnections({
      applicationContext,
      connections: allWebsocketConnections,
      messageStringified,
    });
};
