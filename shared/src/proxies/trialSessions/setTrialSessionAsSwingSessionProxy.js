const { post } = require('../requests');

/**
 * setTrialSessionAsSwingSessionInteractor
 *
 * @param applicationContext
 * @param swingSessionId
 * @param trialSessionId
 * @returns {Promise<*>}
 */
exports.setTrialSessionAsSwingSessionInteractor = ({
  applicationContext,
  swingSessionId,
  trialSessionId,
}) => {
  return post({
    applicationContext,
    body: { swingSessionId },
    endpoint: `/trial-sessions/${trialSessionId}/set-swing-session`,
  });
};
