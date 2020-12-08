const { post } = require('../requests');

/**
 * addCaseToTrialSessionInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.docketNumber the case docket number
 * @param {object} providers.trialSessionId the trial session id
 * @returns {Promise<*>} the promise of the api call
 */
exports.addCaseToTrialSessionInteractor = ({
  applicationContext,
  docketNumber,
  trialSessionId,
  trialSessionNote,
}) => {
  return post({
    applicationContext,
    body: { trialSessionNote },
    endpoint: `/trial-sessions/${trialSessionId}/cases/${docketNumber}`,
  });
};
