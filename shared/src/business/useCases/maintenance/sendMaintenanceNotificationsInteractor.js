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
    } catch (err) {
      if (index >= allWebsocketConnections.length) {
        if (err.statusCode === 410) {
          // await client.delete({
          //   applicationContext,
          //   key: {
          //     pk: connection.pk,
          //     sk: connection.sk,
          //   },
          // });
        } else {
          console.log('as;dlkjfslkdjf');
          applicationContext.logger.error(
            'An error occurred while attempting to send notification to user',
            { error: err },
          );
          throw err;
        }
      }
    }
  }
};
