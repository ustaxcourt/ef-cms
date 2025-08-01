import { get } from '@shared/proxies/requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getConsolidatedCaseDeadlinesInteractor = (
  applicationContext: ClientApplicationContext,
  { consolidatedCaseDeadlineId }: { consolidatedCaseDeadlineId: string },
): Promise<
  {
    docketNumber: string;
    caption: string;
  }[]
> => {
  return get({
    applicationContext,
    endpoint: `/consolidated-case-deadlines/${consolidatedCaseDeadlineId}`,
  });
};
