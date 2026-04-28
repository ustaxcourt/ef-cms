import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getCaseDeadlinesInteractor = (
  applicationContext: ClientApplicationContext,
  { endDate, from, judgeId, startDate },
) => {
  return get({
    applicationContext,
    endpoint: '/case-deadlines',
    params: {
      endDate,
      from,
      judgeId,
      startDate,
    },
  });
};
