import { getResponse } from './requests';

export const getCaseDocketEntriesInteractor = (
  applicationContext,
  {
    docketNumber,
    eventCodes,
    page,
    pageSize,
  }: {
    docketNumber: string;
    eventCodes?: string[];
    page?: number;
    pageSize?: number;
  },
): Promise<{
  docketEntries: RawDocketEntry[];
  archivedDocketEntries: RawDocketEntry[];
  totalCount: number;
  hasPendingItems: boolean;
}> =>
  getResponse({
    applicationContext,
    asyncSyncId: undefined,
    endpoint: `/cases/${docketNumber}/docket-entries`,
    params: {
      eventCodes: eventCodes ? eventCodes.join(',') : undefined,
      page,
      pageSize,
    },
  }).then(response => response.data);
