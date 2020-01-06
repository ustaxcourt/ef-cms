const { post } = require('../requests');

/**
 * setNoticesForCalendaredTrialSessionInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.trialSessionId the trial session id
 * @returns {Promise<*>} the promise of the api call
 */
exports.setNoticesForCalendaredTrialSessionInteractor = ({
  applicationContext,
  trialSessionId,
}) => {
  return post({
    applicationContext,
    body: {},
    endpoint: `/trial-sessions/${trialSessionId}/generate-notices`,
  });
};
