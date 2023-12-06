import { put } from '../requests';

/**
 * dismissNOTTReminderForTrialInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.trialSessionId the trial session ID
 * @returns {Promise<*>} the promise of the api call
 */
export const dismissNOTTReminderForTrialInteractor = (
  applicationContext,
  { trialSessionId },
) => {
  return put({
    applicationContext,
    body: { trialSessionId },
    endpoint: '/trial-sessions/dismiss-alert',
  });
};
