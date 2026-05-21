import { ServerApplicationContext } from '@web-api/applicationContext';

export const sendReadOnlyNotificationsInteractor = async (
  applicationContext: ServerApplicationContext,
  { readOnlyMode }: { readOnlyMode: boolean },
) => {
  const allWebsocketConnections = await applicationContext
    .getPersistenceGateway()
    .getAllWebSocketConnections();

  const readOnlyModeMessage = readOnlyMode
    ? 'read_only_mode_engaged'
    : 'read_only_mode_disengaged';

  const messageStringified = JSON.stringify({
    action: readOnlyModeMessage,
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
