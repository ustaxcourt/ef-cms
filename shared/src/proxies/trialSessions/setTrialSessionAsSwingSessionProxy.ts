const { post } = require('../requests');

/**
 * setTrialSessionAsSwingSessionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.swingSessionId the id of the trial session to add as a swing session
 * @param {string} providers.trialSessionId the trial session to add the swing session to
 * @returns {Promise<*>} the promise of the api call
 */
exports.setTrialSessionAsSwingSessionInteractor = (
  applicationContext,
  { swingSessionId, trialSessionId },
) => {
  return post({
    applicationContext,
    body: { swingSessionId },
    endpoint: `/trial-sessions/${trialSessionId}/set-swing-session`,
  });
};
