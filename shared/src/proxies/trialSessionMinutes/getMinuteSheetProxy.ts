import { get } from '../requests';
import qs from 'qs';

export const getMinuteSheetInteractor = (
  applicationContext,
  { docketNumber, trialSessionId },
) => {
  const queryString = qs.stringify({
    docketNumber,
    trialSessionId,
  });
  return get({
    applicationContext,
    endpoint: `/trial-sessions/minutes?${queryString}`,
  });
};
