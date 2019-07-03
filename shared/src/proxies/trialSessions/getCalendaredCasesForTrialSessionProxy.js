const { get } = require('../requests');

/**
 * get calendared cases for trial session
 *
 * @param applicationContext
 * @param trialSessionId
 * @returns {Promise<*>}
 */
exports.getCalendaredCasesForTrialSession = ({
  applicationContext,
  trialSessionId,
}) => {
  return get({
    applicationContext,
    endpoint: `/trial-sessions/${trialSessionId}/get-calendared-cases`,
  });
};
