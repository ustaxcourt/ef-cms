const { post } = require('../requests');

/**
 * batchDownloadTrialSessionInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.trialSessionId the id of the trial session to get the details
 * @param {string} providers.caseHtml the html of the docket records
 * @returns {Promise<*>} the promise of the api call
 */
exports.batchDownloadTrialSessionInteractor = ({
  applicationContext,
  caseDetails,
  trialSessionId,
}) => {
  return post({
    applicationContext,
    body: {
      caseDetails,
      trialSessionId,
    },
    endpoint: `/trial-sessions/${trialSessionId}/batch-download`,
  });
};
