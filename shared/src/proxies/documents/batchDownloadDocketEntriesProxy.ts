import { get } from '../requests';

export const batchDownloadDocketEntriesInteractor = (
  applicationContext,
  { documentIds }: { documentIds: string[] },
) => {
  return get({
    applicationContext,
    endpoint: '/async/documents/batch-download',
    params: { documentIds },
  });
};
