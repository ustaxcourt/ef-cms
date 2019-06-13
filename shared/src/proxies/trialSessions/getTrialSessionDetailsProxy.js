const { get } = require('../requests');

/**
 * getTrialSessionDetails
 *
 * @param applicationContext
 * @param swingSessionId
 * @param trialSessionId
 * @returns {Promise<*>}
 */
exports.getTrialSessionDetails = ({ applicationContext, trialSessionId }) => {
  return get({
    applicationContext,
    endpoint: `/trialSessions/${trialSessionId}`,
  });
};
