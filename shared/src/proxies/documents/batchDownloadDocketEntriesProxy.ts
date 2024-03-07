import { DownloadDocketEntryRequestType } from '@shared/business/useCases/document/batchDownloadDocketEntriesInteractor';
import { get } from '../requests';

export const batchDownloadDocketEntriesInteractor = (
  applicationContext,
  params: DownloadDocketEntryRequestType,
) => {
  return get({
    applicationContext,
    endpoint: '/async/documents/batch-download',
    params,
  });
};
