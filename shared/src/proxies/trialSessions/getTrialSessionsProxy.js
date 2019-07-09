const { get } = require('../requests');

/**
 * getTrialSessionsInteractor
 *
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getTrialSessionsInteractor = ({ applicationContext }) => {
  return get({
    applicationContext,
    endpoint: `/api/trial-sessions`,
  });
};
