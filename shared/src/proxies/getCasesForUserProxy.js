const { get } = require('./requests');

/**
 * getCasesForUserInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
exports.getCasesForUserInteractor = applicationContext => {
  return get({
    applicationContext,
    endpoint: '/cases',
  });
};
