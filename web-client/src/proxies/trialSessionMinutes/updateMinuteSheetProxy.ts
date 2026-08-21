import { MinuteSheetUpdateBody } from '@web-api/business/useCases/trialSessionMinutes/updateMinuteSheetInteractor';
import { applicationContext } from '@web-client/applicationContext';
import { put } from '../requests';
import { MinuteSheet } from '@shared/business/entities/trialSessionMinutes/MinuteSheet';

export const updateMinuteSheetInteractor = ({
  docketNumber,
  minuteSheet,
  trialSessionId,
}: MinuteSheetUpdateBody): Promise<
  | {
      trialSessionId: string;
      docketNumber: string;
      content: MinuteSheet;
    }
  | undefined
> => {
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
