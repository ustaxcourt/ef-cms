const { get } = require('../requests');

/**
 * getCaseDeadlinesForCaseInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to get deadlines for
 * @returns {Promise<*>} the promise of the api call
 */
exports.getCaseDeadlinesForCaseInteractor = (
  applicationContext,
  { docketNumber },
) => {
  return get({
    applicationContext,
    endpoint: `/case-deadlines/${docketNumber}`,
  });
};
