import { ServerApplicationContext } from '@web-api/applicationContext';

export const sendMaintenanceNotificationsInteractor = async (
  applicationContext: ServerApplicationContext,
  { maintenanceMode }: { maintenanceMode: boolean },
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

  const messageStringified = JSON.stringify({
    action: maintenanceModeMessage,
  });

  await applicationContext
    .getNotificationGateway()
    .retrySendNotificationToConnections({
      applicationContext,
      connections: allWebsocketConnections,
      deleteGoneConnections: false, // don't delete because the connection might be on a different region
      messageStringified,
    });
};
