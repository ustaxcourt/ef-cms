const { put } = require('./requests');

/**
 * updateCaseContextInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.associatedJudge the judge to be associated with the case
 * @param {string} providers.caseCaption the caption to update
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {object} providers.caseStatus the updated case status
 * @returns {Promise<*>} the promise of the api call
 */
exports.updateCaseContextInteractor = (
  applicationContext,
  { caseCaption, caseStatus, docketNumber, judgeUserId },
) => {
  return put({
    applicationContext,
    body: { caseCaption, caseStatus, judgeUserId },
    endpoint: `/case-meta/${docketNumber}/case-context`,
  });
};
