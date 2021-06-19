const { put } = require('../requests');

/**
 * updateTrialSessionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.trialSession the trial session data
 * @returns {Promise<*>} the promise of the api call
 */
exports.updateTrialSessionInteractor = (
  applicationContext,
  { trialSession },
) => {
  return put({
    applicationContext,
    body: trialSession,
    endpoint: '/trial-sessions',
  });
};
