const { put } = require('../requests');

/**
 * updateTrialSessionWorkingCopyInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
exports.updateTrialSessionWorkingCopyInteractor = ({
  applicationContext,
  trialSessionWorkingCopyToUpdate,
}) => {
  return put({
    applicationContext,
    body: trialSessionWorkingCopyToUpdate,
    endpoint: `/trial-sessions/${trialSessionWorkingCopyToUpdate.trialSessionId}/working-copy`,
  });
};
