import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const generateTrialCalendarPdfInteractor = (
  applicationContext: ClientApplicationContext,
  { trialSessionId },
): Promise<{ fileId: string; url: string }> => {
  return post({
    applicationContext,
    body: {
      trialSessionId,
    },
    endpoint: '/reports/trial-calendar-pdf',
  });
};
