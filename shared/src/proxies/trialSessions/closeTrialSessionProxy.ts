const { post } = require('../requests');

/**
 * closeTrialSessionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.trialSessionId the trial session id
 * @returns {Promise<*>} the promise of the api call
 */
exports.closeTrialSessionInteractor = (
  applicationContext,
  { trialSessionId },
) => {
  return post({
    applicationContext,
    endpoint: `/trial-sessions/${trialSessionId}/close`,
  });
};
