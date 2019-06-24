const { post } = require('../requests');

/**
 * set trial session calendar
 *
 * @param applicationContext
 * @param trialSessionId
 * @returns {Promise<*>}
 */
exports.setTrialSessionCalendar = ({ applicationContext, trialSessionId }) => {
  return post({
    applicationContext,
    endpoint: `/trialSessions/${trialSessionId}/setCalendar`,
  });
};
