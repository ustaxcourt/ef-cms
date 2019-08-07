const { put } = require('./requests');

/**
 * setCaseToReadyForTrialInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to set ready for trial
 * @returns {Promise<*>} the promise of the api call
 */
exports.setCaseToReadyForTrialInteractor = ({ applicationContext, caseId }) => {
  return put({
    applicationContext,
    endpoint: `/cases/${caseId}/set-to-ready-for-trial`,
  });
};
