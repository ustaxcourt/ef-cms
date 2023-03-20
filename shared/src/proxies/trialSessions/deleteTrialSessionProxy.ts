const { remove } = require('../requests');

/**
 * deleteTrialSessionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.trialSession the trial session data
 * @returns {Promise<*>} the promise of the api call
 */
exports.deleteTrialSessionInteractor = (
  applicationContext,
  { trialSessionId },
) => {
  return remove({
    applicationContext,
    endpoint: `/trial-sessions/${trialSessionId}`,
  });
};
