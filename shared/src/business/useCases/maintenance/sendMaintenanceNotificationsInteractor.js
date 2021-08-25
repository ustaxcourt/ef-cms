/**
 * @param {object} applicationContext the application context
 */
exports.sendMaintenanceNotificationsInteractor = async applicationContext => {
  applicationContext.logger.debug('this is working!');
  //send notification to all users?

  // getWebSocketConnectionsByUserId to add gsi1pk to all dynamo records
  //  add migration script

  // get all connections by gsi1pk
  // postToConnection - call for each connection to alert that maintenance mode is on
};
