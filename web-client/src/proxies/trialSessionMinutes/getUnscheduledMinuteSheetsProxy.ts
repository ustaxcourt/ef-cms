import { applicationContext } from '@web-client/applicationContext';
import { get } from '../requests';
import qs from 'qs';

export const getUnscheduledMinuteSheetsInteractor = ({
  trialSessionId,
}: {
  trialSessionId: string;
}) => {
  const queryString = qs.stringify({
    trialSessionId,
  });
  return get({
    applicationContext,
    endpoint: `/trial-sessions/minutes/unscheduled?${queryString}`,
  });
};
