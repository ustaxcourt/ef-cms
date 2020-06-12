const { get } = require('./requests');

/**
 * getOpenCasesInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
exports.getOpenCasesInteractor = ({ applicationContext }) => {
  return get({
    applicationContext,
    endpoint: '/cases/open-cases',
  });
};
