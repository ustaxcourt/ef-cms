/**
 * onConnectInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.connectionId the websocket connection id
 * @param {string} providers.endpoint the websocket endpoint url
 * @returns {Promise<object>} item updated in persistence
 */

exports.onConnectInteractor = async (
  applicationContext,
  { clientConnectionId, connectionId, endpoint },
) => {
  const authorizedUser = applicationContext.getCurrentUser();
  if (!authorizedUser) {
    // silence local development errors
    return;
  }

  await applicationContext.getPersistenceGateway().saveUserConnection({
    applicationContext,
    clientConnectionId,
    connectionId,
    endpoint,
    userId: authorizedUser.userId,
  });
};
