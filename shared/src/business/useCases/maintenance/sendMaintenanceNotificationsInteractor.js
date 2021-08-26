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

  const maxRetries = 1;

  for (let index = 0; index < allWebsocketConnections.length; index++) {
    for (let retryCount = 0; retryCount <= maxRetries; retryCount++) {
      try {
        await applicationContext
          .getNotificationGateway()
          .sendNotificationToConnection({
            applicationContext,
            connection: allWebsocketConnections[index],
            messageStringified,
          });
        break;
      } catch (err) {
        if (retryCount >= maxRetries) {
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
            console.log('doinna throw');
            throw err;
          }
        }
      }
    }
  }
};
