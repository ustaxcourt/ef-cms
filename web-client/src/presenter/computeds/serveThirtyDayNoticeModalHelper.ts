import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const serveThirtyDayNoticeModalHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): { formattedStartDate: string; trialLocation: string } => {
  const { startDate, trialLocation } = get(state.trialSession);

  const formattedStartDate = applicationContext
    .getUtilities()
    .formatDateString(startDate, 'MM/dd/yy');

  return {
    formattedStartDate,
    trialLocation: trialLocation!,
  };
};
