const { put } = require('../requests');

/**
 * updateTrialSessionWorkingCopyInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.trialSessionWorkingCopyToUpdate the trial session working copy data to update
 * @returns {Promise<*>} the promise of the api call
 */
exports.updateTrialSessionWorkingCopyInteractor = (
  applicationContext,
  { trialSessionWorkingCopyToUpdate },
) => {
  return put({
    applicationContext,
    body: trialSessionWorkingCopyToUpdate,
    endpoint: `/trial-sessions/${trialSessionWorkingCopyToUpdate.trialSessionId}/working-copy`,
  });
};
