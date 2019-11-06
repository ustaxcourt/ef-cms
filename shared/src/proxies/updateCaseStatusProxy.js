const { put } = require('./requests');

/**
 * updateCaseStatusInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update
 * @param {object} providers.caseStatus the updated case status
 * @returns {Promise<*>} the promise of the api call
 */
exports.updateCaseStatusInteractor = ({
  applicationContext,
  caseId,
  caseStatus,
}) => {
  return put({
    applicationContext,
    body: caseStatus,
    endpoint: `/cases/${caseId}/case-status`,
  });
};
