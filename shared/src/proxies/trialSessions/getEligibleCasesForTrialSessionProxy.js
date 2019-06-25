const { get } = require('../requests');

/**
 * get eligible cases for trial session
 *
 * @param applicationContext
 * @param trialSessionId
 * @returns {Promise<*>}
 */
exports.getEligibleCasesForTrialSession = ({
  applicationContext,
  trialSessionId,
}) => {
  return get({
    applicationContext,
    endpoint: `/trial-sessions/${trialSessionId}/eligible-cases`,
  });
};
