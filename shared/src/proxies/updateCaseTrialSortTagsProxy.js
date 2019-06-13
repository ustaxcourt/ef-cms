const { put } = require('../requests');

/**
 * createTrialSession
 *
 * @param trialSession
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.updateCaseTrialSortTags = ({ applicationContext, caseId }) => {
  return put({
    applicationContext,
    endpoint: `/cases/${caseId}/updateCaseTrialSortTags`,
  });
};
