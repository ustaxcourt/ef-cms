import { put } from '../requests';

/**
 * updateTrialSessionInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.trialSession the trial session data
 * @returns {Promise<*>} the promise of the api call
 */
exports.updateTrialSessionInteractor = (
  applicationContext,
  { isDismissingThirtyDayAlert, trialSession },
) => {
  return put({
    applicationContext,
    body: { isDismissingThirtyDayAlert, trialSession },
    endpoint: '/async/trial-sessions',
  });
};
