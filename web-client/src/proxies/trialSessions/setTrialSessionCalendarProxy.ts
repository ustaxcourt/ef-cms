import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const setTrialSessionCalendarInteractor = (
  applicationContext: ClientApplicationContext,
  {
    clientConnectionId,
    trialSessionId,
  }: { trialSessionId: string; clientConnectionId: string },
): Promise<void> => {
  return post({
    applicationContext,
    body: { clientConnectionId },
    endpoint: `/async/trial-sessions/${trialSessionId}/set-calendar`,
  });
};
