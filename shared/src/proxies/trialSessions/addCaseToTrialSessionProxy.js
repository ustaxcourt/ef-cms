const { post } = require('../requests');

/**
 * addCaseToTrialSessionInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.trialSession the trial session data
 * @returns {Promise<*>} the promise of the api call
 */
exports.addCaseToTrialSessionInteractor = ({
  applicationContext,
  caseId,
  trialSessionId,
}) => {
  return post({
    applicationContext,
    body: {},
    endpoint: `/trial-sessions/${trialSessionId}/cases/${caseId}`,
  });
};
