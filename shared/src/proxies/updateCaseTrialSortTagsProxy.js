const { put } = require('./requests');

/**
 * updateCaseTrialSortTagsInteractor
 *
 * @param applicationContext
 * @param caseId
 * @returns {Promise<*>}
 */
exports.updateCaseTrialSortTagsInteractor = ({ applicationContext, caseId }) => {
  return put({
    applicationContext,
    endpoint: `/cases/${caseId}/update-case-trial-sort-tags`,
  });
};
