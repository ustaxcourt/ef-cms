import { MinuteSheetUpdateBody } from '@web-api/business/useCases/trialSessionMinutes/updateMinuteSheetInteractor';
import { applicationContext } from '@web-client/applicationContext';
import { put } from '../requests';

export const updateMinuteSheetInteractor = ({
  docketNumber,
  minuteSheet,
  trialSessionId,
}: MinuteSheetUpdateBody) => {
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
