const { put } = require('./requests');

/**
 * setCaseToReadyForTrialInteractor
 *
 * @param applicationContext
 * @param caseToUpdate
 * @returns {Promise<*>}
 */
exports.setCaseToReadyForTrialInteractor = ({ applicationContext, caseId }) => {
  return put({
    applicationContext,
    endpoint: `/cases/${caseId}/set-to-ready-for-trial`,
  });
};
