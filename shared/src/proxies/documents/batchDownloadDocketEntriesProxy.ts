import { DownloadDocketEntryRequestType } from '@web-api/business/useCases/document/batchDownloadDocketEntriesInteractor';
import { post } from '../requests';

export const batchDownloadDocketEntriesInteractor = (
  applicationContext,
  params: DownloadDocketEntryRequestType,
) => {
  return post({
    applicationContext,
    body: params,
    endpoint: '/async/case-documents/batch-download',
  });
};
