const { post } = require('../requests');

/**
 * createTrialSession
 *
 * @param trialSession
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.createTrialSession = ({ applicationContext, trialSession }) => {
  return post({
    applicationContext,
    body: trialSession,
    endpoint: `/trial-sessions`,
  });
};
