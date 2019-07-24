const { get } = require('../requests');

/**
 * get calendared cases for trial session
 *
 * @param applicationContext
 * @param trialSessionId
 * @returns {Promise<*>}
 */
exports.getCalendaredCasesForTrialSessionInteractor = ({
  applicationContext,
  trialSessionId,
}) => {
  return get({
    applicationContext,
    endpoint: `/api/trial-sessions/${trialSessionId}/get-calendared-cases`,
  });
};
