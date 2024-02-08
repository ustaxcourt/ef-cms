import { post } from '../requests';

export const serveThirtyDayNoticeInteractor = (
  applicationContext,
  { clientConnectionId, trialSessionId },
) => {
  return post({
    applicationContext,
    body: { clientConnectionId, trialSessionId },
    endpoint: '/async/trial-sessions/serve-thirty-day-notice',
  });
};
