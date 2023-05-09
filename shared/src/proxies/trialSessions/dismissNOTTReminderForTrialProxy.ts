import { put } from '../requests';

/**
 * updateTrialSessionInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.trialSession the trial session data
 * @returns {Promise<*>} the promise of the api call
 */
export const dismissNOTTReminderForTrialInteractor = (
  applicationContext,
  { trialSessionId },
) => {
  console.log(trialSessionId, 'PROXYXYXYXYYXY');
  return put({
    applicationContext,
    body: trialSessionId,
    endpoint: '/async/trial-sessions/dismiss-alert',
  });
};
