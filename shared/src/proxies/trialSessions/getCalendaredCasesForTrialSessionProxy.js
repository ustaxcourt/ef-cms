const { get } = require('../requests');

/**
 * get calendared cases for trial session
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.trialSessionId the id of the trial session to get the calendared cases
 * @returns {Promise<*>} the promise of the api call
 */
exports.getCalendaredCasesForTrialSessionInteractor = (
  applicationContext,
  { trialSessionId },
) => {
  return get({
    applicationContext,
    endpoint: `/trial-sessions/${trialSessionId}/get-calendared-cases`,
  });
};
