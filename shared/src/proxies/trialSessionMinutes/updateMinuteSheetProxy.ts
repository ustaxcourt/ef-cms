import { MinuteSheetUpdateBody } from '@web-api/business/useCases/trialSessionMinutes/updateMinuteSheetInteractor';
import { put } from '../requests';

export const updateMinuteSheetInteractor = (
  applicationContext,
  { docketNumber, minuteSheet, trialSessionId }: MinuteSheetUpdateBody,
) => {
  return put({
    applicationContext,
    body: {
      docketNumber,
      minuteSheet,
      trialSessionId,
    },
    endpoint: '/trial-sessions/minutes',
  });
};
