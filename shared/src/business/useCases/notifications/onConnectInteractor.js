/**
 * onConnectInteractor
 *
 */
exports.onConnectInteractor = async ({ applicationContext, connectionId }) => {
  const authorizedUser = applicationContext.getCurrentUser();

  console.log('user', authorizedUser);

  await applicationContext.getPersistenceGateway().saveUserConnection({
    applicationContext,
    connectionId,
    userId: authorizedUser.userId,
  });
};
