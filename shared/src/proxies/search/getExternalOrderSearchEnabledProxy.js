const { get } = require('../requests');

/**
 * getExternalOrderSearchEnabledInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
exports.getExternalOrderSearchEnabledInteractor = applicationContext => {
  return get({
    applicationContext,
    endpoint: '/search/external-order-search-enabled',
  });
};
