const { get } = require('./requests');

/**
 * runBatchProcess
 *
 * @param applicationContext
 * @param caseId
 * @param userId
 * @returns {Promise<*>}
 */
exports.runBatchProcess = ({ applicationContext, caseId }) => {
  return get({
    applicationContext,
    endpoint: `/cases/${caseId}/runBatchProcess`,
  });
};
