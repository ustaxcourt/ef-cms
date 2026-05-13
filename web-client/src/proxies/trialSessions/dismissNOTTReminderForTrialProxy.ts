import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const dismissNOTTReminderForTrialInteractor = (
  applicationContext: ClientApplicationContext,
  { trialSessionId },
): Promise<void> => {
  return put({
    applicationContext,
    body: { trialSessionId },
    endpoint: '/trial-sessions/dismiss-alert',
  });
};
