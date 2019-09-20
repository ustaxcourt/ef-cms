/**
 * onDisconnectInteractor
 */
exports.onDisconnectInteractor = async ({
  applicationContext,
  connectionId,
}) => {
  await applicationContext.getPersistenceGateway().deleteUserConnection({
    applicationContext,
    connectionId,
  });
};
