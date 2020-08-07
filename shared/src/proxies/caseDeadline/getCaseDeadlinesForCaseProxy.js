const { get } = require('../requests');

/**
 * getCaseDeadlinesForCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to get deadlines for
 * @returns {Promise<*>} the promise of the api call
 */
exports.getCaseDeadlinesForCaseInteractor = ({
  applicationContext,
  docketNumber,
}) => {
  return get({
    applicationContext,
    endpoint: `/case-deadlines/${docketNumber}`,
  });
};
