const { get } = require('../requests');

/**
 * batchDownloadTrialSessionInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.trialSession the trial session data
 * @returns {Promise<*>} the promise of the api call
 */
exports.batchDownloadTrialSessionInteractor = ({
  applicationContext,
  trialSessionId,
  zipName,
}) => {
  return get({
    applicationContext,
    body: {},
    endpoint: `/trial-sessions/${trialSessionId}/batch-download/${zipName}`,
  });
};
