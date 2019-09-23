/**
 * onConnectInteractor
 *
 */
exports.onConnectInteractor = async ({
  applicationContext,
  connectionId,
  endpoint,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  await applicationContext.getPersistenceGateway().saveUserConnection({
    applicationContext,
    connectionId,
    endpoint,
    userId: authorizedUser.userId,
  });
};
