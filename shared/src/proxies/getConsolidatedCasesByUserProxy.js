const { get } = require('./requests');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
exports.getConsolidatedCasesByUserInteractor = ({ applicationContext }) => {
  const user = applicationContext.getCurrentUser();
  return get({
    applicationContext,
    endpoint: `/users/${user.userId}/cases-with-consolidation`,
  });
};
