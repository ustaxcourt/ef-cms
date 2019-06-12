const { put } = require('./requests');

/**
 * setCaseToReadyForTrial
 *
 * @param applicationContext
 * @param caseToUpdate
 * @returns {Promise<*>}
 */
exports.setCaseToReadyForTrial = ({ applicationContext, caseToUpdate }) => {
  return put({
    applicationContext,
    body: caseToUpdate,
    endpoint: `/cases/${caseToUpdate.caseId}/setToReadyForTrial`,
  });
};
