const { get } = require('../requests');

/**
 * getInternalOrderSearchEnabledInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
exports.getInternalOrderSearchEnabledInteractor = applicationContext => {
  return get({
    applicationContext,
    endpoint: '/search/internal-order-search-enabled',
  });
};
