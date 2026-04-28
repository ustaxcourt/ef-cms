import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const generateTrialCalendarPdfInteractor = (
  applicationContext: ClientApplicationContext,
  { trialSessionId },
) => {
  return post({
    applicationContext,
    body: {
      trialSessionId,
    },
    endpoint: '/reports/trial-calendar-pdf',
  });
};
