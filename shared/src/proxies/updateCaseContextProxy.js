const { put } = require('./requests');

/**
 * updateCaseContextInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.associatedJudge the judge to be associated with the case
 * @param {string} providers.caseCaption the caption to update
 * @param {string} providers.caseId the id of the case to update
 * @param {object} providers.caseStatus the updated case status
 * @returns {Promise<*>} the promise of the api call
 */
exports.updateCaseContextInteractor = ({
  applicationContext,
  associatedJudge,
  caseCaption,
  caseId,
  caseStatus,
}) => {
  return put({
    applicationContext,
    body: { associatedJudge, caseCaption, caseStatus },
    endpoint: `/cases/${caseId}/case-context`,
  });
};
