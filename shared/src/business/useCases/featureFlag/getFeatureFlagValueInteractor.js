/**
 * getInternalOrderSearchEnabledInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {boolean} true if result of the persistence method is 'true'; false otherwise
 */

exports.getInternalOrderSearchEnabledInteractor = async applicationContext => {
  return await applicationContext
    .getPersistenceGateway()
    .getInternalOrderSearchEnabled({ applicationContext });
};
