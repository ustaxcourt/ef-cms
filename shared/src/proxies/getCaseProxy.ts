const { get } = require('./requests');

/**
 * getCaseInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the id of the case to retrieve
 * @returns {Promise<*>} the promise of the api call
 */
exports.getCaseInteractor = (applicationContext, { docketNumber }) => {
  return get({
    applicationContext,
    endpoint: `/cases/${docketNumber}`,
  });
};
