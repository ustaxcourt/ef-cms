const { put } = require('./requests');

/**
 * updateQcCompleteForTrialInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {boolean} providers.qcCompleteForTrial true if case is qc complete for trial, false otherwise
 * @param {string} providers.trialSessionId the id of the trial session to update
 * @returns {Promise<*>} the promise of the api call
 */
exports.updateQcCompleteForTrialInteractor = (
  applicationContext,
  { docketNumber, qcCompleteForTrial, trialSessionId },
) => {
  return put({
    applicationContext,
    body: { qcCompleteForTrial, trialSessionId },
    endpoint: `/case-meta/${docketNumber}/qc-complete`,
  });
};
