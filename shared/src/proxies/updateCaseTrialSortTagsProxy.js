const { put } = require('./requests');

/**
 * updateCaseTrialSortTags
 *
 * @param applicationContext
 * @param caseId
 * @returns {Promise<*>}
 */
exports.updateCaseTrialSortTags = ({ applicationContext, caseId }) => {
  return put({
    applicationContext,
    endpoint: `/cases/${caseId}/update-case-trial-sort-tags`,
  });
};
