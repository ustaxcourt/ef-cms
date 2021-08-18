const { get } = require('./requests');

/**
 * getOrderSearchEnabledInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @returns {Promise<*>} the promise of the api call
 */
exports.getOrderSearchEnabledInteractor = applicationContext => {
  return get({
    applicationContext,
    endpoint: '/search/order-search-enabled',
  });
};
