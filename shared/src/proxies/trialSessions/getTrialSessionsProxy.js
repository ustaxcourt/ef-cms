const { get } = require('../requests');

/**
 * getTrialSessionsProxy
 *
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getTrialSessions = ({ applicationContext }) => {
  return get({
    applicationContext,
    endpoint: `/trialSessions`,
  });
};
