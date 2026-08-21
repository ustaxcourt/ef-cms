import { get } from '@web-client/proxies/requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getConsolidatedCaseDeadlinesInteractor = (
  applicationContext: ClientApplicationContext,
  { consolidatedCaseDeadlineId }: { consolidatedCaseDeadlineId: string },
): Promise<{ docketNumber: string; caseCaption: string }[]> => {
  return get({
    applicationContext,
    endpoint: `/consolidated-case-deadlines/${consolidatedCaseDeadlineId}`,
  });
};
