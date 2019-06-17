const { get } = require('../requests');

/**
 * get associated cases for trial session
 *
 * @param applicationContext
 * @param trialSessionId
 * @returns {Promise<*>}
 */
exports.getAssociatedCasesForTrialSessionProxy = ({
  applicationContext,
  trialSessionId,
}) => {
  return get({
    applicationContext,
    endpoint: `/trialSessions/${trialSessionId}/getAssociatedCases`,
  });
};
