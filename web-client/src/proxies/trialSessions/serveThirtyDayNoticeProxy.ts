import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const serveThirtyDayNoticeInteractor = (
  applicationContext: ClientApplicationContext,
  { clientConnectionId, trialSessionId },
): Promise<void> => {
  return post({
    applicationContext,
    body: { clientConnectionId, trialSessionId },
    endpoint: '/async/trial-sessions/serve-thirty-day-notice',
  });
};
