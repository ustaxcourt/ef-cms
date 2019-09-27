/**
 * onDisconnectInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.connectionId the websocket connection id
 * @returns {Promise} which resolves when connections have been deleted
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
