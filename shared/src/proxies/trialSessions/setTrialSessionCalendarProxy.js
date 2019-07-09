const { post } = require('../requests');

/**
 * set trial session calendar
 *
 * @param applicationContext
 * @param trialSessionId
 * @returns {Promise<*>}
 */
exports.setTrialSessionCalendarInteractor = ({
  applicationContext,
  trialSessionId,
}) => {
  return post({
    applicationContext,
    endpoint: `/api/trial-sessions/${trialSessionId}/set-calendar`,
  });
};
