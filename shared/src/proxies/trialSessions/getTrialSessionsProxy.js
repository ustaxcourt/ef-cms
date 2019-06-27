const { get } = require('../requests');

/**
 * getTrialSessions
 *
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getTrialSessions = ({ applicationContext }) => {
  return get({
    applicationContext,
    endpoint: `/trial-sessions`,
  });
};
