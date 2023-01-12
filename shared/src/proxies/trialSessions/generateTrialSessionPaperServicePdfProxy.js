const { post } = require('../requests');

/**
 * generateTrialSessionPaperServicePdfInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.trialSessionId the trial session id
 * @param {string} providers.docketNumber optional docketNumber for setting a single case
 * @returns {Promise<*>} the promise of the api call
 */
exports.generateTrialSessionPaperServicePdfInteractor = (
  applicationContext,
  { trialSessionId },
) => {
  return post({
    applicationContext,
    endpoint: '/async/trial-sessions/name-me-please',
  });
};
