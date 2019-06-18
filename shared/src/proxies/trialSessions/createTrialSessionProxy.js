const { post } = require('../requests');

/**
 * createTrialSession
 *
 * @param trialSession
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.createTrialSession = ({ trialSession, applicationContext }) => {
  return post({
    applicationContext,
    body: trialSession,
    endpoint: `/trialSessions`,
  });
};
