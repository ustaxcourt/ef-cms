const { get } = require('./requests');

/**
 * getOpenConsolidatedCasesInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
exports.getOpenConsolidatedCasesInteractor = ({ applicationContext }) => {
  return get({
    applicationContext,
    endpoint: '/cases/open',
  });
};
