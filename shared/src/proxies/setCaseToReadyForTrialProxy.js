const { put } = require('./requests');

/**
 * setCaseToReadyForTrial
 *
 * @param applicationContext
 * @param caseToUpdate
 * @returns {Promise<*>}
 */
exports.setCaseToReadyForTrial = ({ applicationContext, caseId }) => {
  return put({
    applicationContext,
    endpoint: `/cases/${caseId}/setToReadyForTrial`,
  });
};
