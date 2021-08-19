const { post } = require('../requests');

/**
 * createTrialSessionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.trialSession the trial session data
 * @returns {Promise<*>} the promise of the api call
 */
exports.createTrialSessionInteractor = (
  applicationContext,
  { trialSession },
) => {
  return post({
    applicationContext,
    body: trialSession,
    endpoint: '/trial-sessions',
  });
};
