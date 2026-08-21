import { applicationContext } from '@web-client/applicationContext';
import { get } from '../requests';
import qs from 'qs';
import { MinuteSheet } from '@shared/business/entities/trialSessionMinutes/MinuteSheet';

export const getMinuteSheetInteractor = ({
  docketNumber,
  trialSessionId,
}): Promise<MinuteSheet> => {
  const queryString = qs.stringify({
    docketNumber,
    trialSessionId,
  });
  return get({
    applicationContext,
    endpoint: `/trial-sessions/minutes?${queryString}`,
  });
};
