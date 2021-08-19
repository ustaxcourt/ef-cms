const { get } = require('./requests');

/**
 * getOpenConsolidatedCasesInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
exports.getOpenConsolidatedCasesInteractor = applicationContext => {
  return get({
    applicationContext,
    endpoint: '/cases/open',
  });
};
