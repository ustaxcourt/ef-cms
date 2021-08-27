/**
 * sendMaintenanceNotificationsInteractor
 *
 * @param {object} applicationContext the application context
 */
exports.sendMaintenanceNotificationsInteractor = async (
  applicationContext,
  { maintenanceMode },
) => {
  const allWebsocketConnections = await applicationContext
    .getPersistenceGateway()
    .getAllWebSocketConnections({ applicationContext });

  await applicationContext.getPersistenceGateway().updateMaintenanceMode({
    applicationContext,
    maintenanceMode,
  });

  const maintenanceModeMessage = maintenanceMode
    ? 'maintenance_mode_engaged'
    : 'maintenance_mode_disengaged';

  applicationContext.logger.error(
    `00 in interactor~~~maintenanceModeMessage!!! ${maintenanceModeMessage}`,
  );

  const messageStringified = JSON.stringify({
    action: maintenanceModeMessage,
  });

  await applicationContext
    .getNotificationGateway()
    .retrySendNotificationToConnections({
      applicationContext,
      connections: allWebsocketConnections,
      messageStringified,
    });
};
