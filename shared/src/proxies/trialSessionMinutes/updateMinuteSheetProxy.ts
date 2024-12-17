import { put } from '../requests';
import qs from 'qs';

export const updateMinuteSheetInteractor = (
  applicationContext,
  { docketNumber, trialSessionId },
) => {
  // 10419 TODO fix this
  const queryString = qs.stringify({
    docketNumber,
    trialSessionId,
  });
  return put({
    applicationContext,
    body: {},
    endpoint: `/trial-sessions/minutes?${queryString}`,
  });
};
