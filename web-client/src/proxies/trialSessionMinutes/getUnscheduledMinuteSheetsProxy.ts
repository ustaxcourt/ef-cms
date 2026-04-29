import { applicationContext } from '@web-client/applicationContext';
import { get } from '../requests';
import qs from 'qs';
import { UnscheduledMinuteSheetInfo } from '@web-api/business/useCases/trialSessionMinutes/getUnscheduledMinuteSheetsInteractor';

export const getUnscheduledMinuteSheetsInteractor = ({
  trialSessionId,
}: {
  trialSessionId: string;
}): Promise<UnscheduledMinuteSheetInfo[]> => {
  const queryString = qs.stringify({
    trialSessionId,
  });
  return get({
    applicationContext,
    endpoint: `/trial-sessions/minutes/unscheduled?${queryString}`,
  });
};
