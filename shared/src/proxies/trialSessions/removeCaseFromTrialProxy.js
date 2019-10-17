const { put } = require('./requests');

/**
 * removeCaseFromTrialInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number to get
 * @returns {Promise<*>} the promise of the api call
 */
exports.removeCaseFromTrialInteractor = ({
  applicationContext,
  caseId,
  disposition,
  trialSessionId,
}) => {
  return put({
    applicationContext,
    body: { disposition },
    endpoint: `/trial-sessions/${trialSessionId}/remove-case/${caseId}`,
  });
};
