/**
 * getOrderSearchEnabledInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {boolean} true if result of the persistence method is 'true'; false otherwise
 */

exports.getOrderSearchEnabledInteractor = async applicationContext => {
  const orderSearchEnabled = await applicationContext
    .getPersistenceGateway()
    .getOrderSearchEnabled({ applicationContext });

  return orderSearchEnabled === 'true';
};
