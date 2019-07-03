const { get } = require('../requests');

/**
 * getTrialSessionDetails
 *
 * @param applicationContext
 * @param trialSessionId
 * @returns {Promise<*>}
 */
exports.getTrialSessionDetails = ({ applicationContext, trialSessionId }) => {
  return get({
    applicationContext,
    endpoint: `/trial-sessions/${trialSessionId}`,
  });
};
