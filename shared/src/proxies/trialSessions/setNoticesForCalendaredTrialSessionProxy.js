const { post } = require('../requests');

/**
 * setNoticesForCalendaredTrialSessionInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.trialSessionId the trial session id
 * @param {string} providers.caseId optional caseId for setting a single case
 * @returns {Promise<*>} the promise of the api call
 */
exports.setNoticesForCalendaredTrialSessionInteractor = ({
  applicationContext,
  caseId = null, // because sending undefined in an http request breaks lambda
  trialSessionId,
}) => {
  return post({
    applicationContext,
    body: {
      caseId,
    },
    endpoint: `/trial-sessions/${trialSessionId}/generate-notices`,
  });
};
