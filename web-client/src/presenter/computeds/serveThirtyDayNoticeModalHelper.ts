import { ClientApplicationContext } from '@web-client/applicationContext';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const serveThirtyDayNoticeModalHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): { formattedStartDate: string; trialLocation: string } => {
  const { startDate, trialLocation } = get(state.trialSession);

  const formattedStartDate = applicationContext
    .getUtilities()
    .formatDateString(startDate, FORMATS.MMDDYY);

  return {
    formattedStartDate,
    trialLocation: trialLocation!,
  };
};
