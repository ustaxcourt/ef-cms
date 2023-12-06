import { post } from '../requests';

export const serveThirtyDayNoticeInteractor = (
  applicationContext,
  { trialSessionId },
) => {
  return post({
    applicationContext,
    body: { trialSessionId },
    endpoint: '/async/trial-sessions/serve-thirty-day-notice',
  });
};
