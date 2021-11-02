/**
 * getExternalOrderSearchEnabledInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {boolean} true if result of the persistence method is 'true'; false otherwise
 */

exports.getExternalOrderSearchEnabledInteractor = async applicationContext => {
  return await applicationContext
    .getPersistenceGateway()
    .getExternalOrderSearchEnabled({ applicationContext });
};
