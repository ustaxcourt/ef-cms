import { applicationContext } from '@web-client/applicationContext';
import { get } from '../requests';
import qs from 'qs';

export const getMinuteSheetInteractor = ({ docketNumber, trialSessionId }) => {
  const queryString = qs.stringify({
    docketNumber,
    trialSessionId,
  });
  return get({
    applicationContext,
    endpoint: `/trial-sessions/minutes?${queryString}`,
  });
};
