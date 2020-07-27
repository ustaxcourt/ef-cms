const { put } = require('../requests');

/**
 * removeCaseFromTrialInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to remove from trial
 * @param {string} providers.disposition the reason the case is being removed from trial
 * @param {string} providers.trialSessionId the id of the trial session containing the case to set to removedFromTrial
 * @returns {Promise<*>} the promise of the api call
 */
exports.removeCaseFromTrialInteractor = ({
  applicationContext,
  disposition,
  docketNumber,
  trialSessionId,
}) => {
  return put({
    applicationContext,
    body: { disposition },
    endpoint: `/trial-sessions/${trialSessionId}/remove-case/${docketNumber}`,
  });
};
