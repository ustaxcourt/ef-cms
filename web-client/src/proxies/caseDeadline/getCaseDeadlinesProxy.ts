import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDeadlineResponseInfo } from '@web-api/business/useCases/getCaseDeadlinesInteractor';

export const getCaseDeadlinesInteractor = (
  applicationContext: ClientApplicationContext,
  { endDate, from, judgeId, startDate },
): Promise<{ deadlines: CaseDeadlineResponseInfo[]; totalCount: number }> => {
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
