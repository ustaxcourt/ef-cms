import { getResponse } from './requests';

export const getCaseDocketEntriesInteractor = (
  applicationContext,
  {
    docketNumber,
    page,
    pageSize,
  }: {
    docketNumber: string;
    page: number;
    pageSize: number;
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
    params: { page, pageSize },
  }).then(response => response.data);
