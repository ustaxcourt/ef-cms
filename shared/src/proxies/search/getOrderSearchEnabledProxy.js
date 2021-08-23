const { get } = require('../requests');

/**
 * getOrderSearchEnabledInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
exports.getOrderSearchEnabledInteractor = applicationContext => {
  return get({
    applicationContext,
    endpoint: '/search/order-search-enabled',
  });
};
