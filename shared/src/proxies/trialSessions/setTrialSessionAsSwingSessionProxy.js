const { post } = require('../requests');

/**
 * setTrialSessionAsSwingSession
 *
 * @param applicationContext
 * @param swingSessionId
 * @param trialSessionId
 * @returns {Promise<*>}
 */
exports.setTrialSessionAsSwingSession = ({
  applicationContext,
  swingSessionId,
  trialSessionId,
}) => {
  return post({
    applicationContext,
    body: { swingSessionId },
    endpoint: `/trialSessions/${trialSessionId}/setSwingSession`,
  });
};
