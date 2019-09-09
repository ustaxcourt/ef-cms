const { get } = require('../requests');

/**
 * getCaseDeadlinesForCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to get deadlines for
 * @returns {Promise<*>} the promise of the api call
 */
exports.getCaseDeadlinesForCaseInteractor = ({
  applicationContext,
  caseId,
}) => {
  return get({
    applicationContext,
    endpoint: `/case-deadlines/${caseId}/case-deadline`,
  });
};
