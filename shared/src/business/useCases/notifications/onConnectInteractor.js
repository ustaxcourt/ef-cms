/**
 * onConnectInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.connectionId the websocket connection id
 * @param {string} providers.endpoint the websocket endpoint url
 * @returns {Promise<object>} item updated in persistence
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
