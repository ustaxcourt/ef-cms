/**
 * @param {object} applicationContext the application context
 */
exports.sendMaintenanceNotificationsInteractor = async applicationContext => {
  applicationContext.logger.debug('this is working!');
  //send notification to all users?

  // getWebSocketConnectionsByUserId to add gsi1pk to all dynamo records
  //  add migration script

  // get all connections by gsi1pk
  const allWebsocketConnections = await applicationContext
    .getPersistenceGateway()
    .getAllWebSocketConnections({ applicationContext });

  applicationContext.logger.info(
    '*****',
    JSON.stringify(allWebsocketConnections, null, 2),
  );

  // todo: dont hardcode
  const messageStringified = JSON.stringify({
    action: 'maintenance_mode_engaged',
  });

  console.log(allWebsocketConnections);

  // postToConnection - call for each connection to alert that maintenance mode is on
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
