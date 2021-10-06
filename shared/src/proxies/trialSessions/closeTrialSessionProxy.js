const { post } = require('../requests');

/**
 * addCaseToTrialSessionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.calendarNotes notes on why the case was added to the trial session
 * @param {object} providers.docketNumber the case docket number
 * @param {object} providers.trialSessionId the trial session id
 * @returns {Promise<*>} the promise of the api call
 */
exports.closeTrialSessionInteractor = (
  applicationContext,
  { trialSessionId },
) => {
  return post({
    applicationContext,
    endpoint: `/trial-sessions/${trialSessionId}/close`,
  });
};
