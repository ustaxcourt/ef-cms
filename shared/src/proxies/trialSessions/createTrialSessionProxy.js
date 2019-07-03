const { post } = require('../requests');

/**
 * createTrialSessionInteractor
 *
 * @param trialSession
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.createTrialSessionInteractor = ({
  applicationContext,
  trialSession,
}) => {
  return post({
    applicationContext,
    body: trialSession,
    endpoint: `/trial-sessions`,
  });
};
