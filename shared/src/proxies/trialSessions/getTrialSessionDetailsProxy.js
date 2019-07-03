const { get } = require('../requests');

/**
 * getTrialSessionDetailsInteractor
 *
 * @param applicationContext
 * @param trialSessionId
 * @returns {Promise<*>}
 */
exports.getTrialSessionDetailsInteractor = ({
  applicationContext,
  trialSessionId,
}) => {
  return get({
    applicationContext,
    endpoint: `/trial-sessions/${trialSessionId}`,
  });
};
