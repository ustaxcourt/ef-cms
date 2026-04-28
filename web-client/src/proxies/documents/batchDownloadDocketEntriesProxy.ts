import { DownloadDocketEntryRequestType } from '@web-api/business/useCases/document/batchDownloadDocketEntriesInteractor';
import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const batchDownloadDocketEntriesInteractor = (
  applicationContext: ClientApplicationContext,
  params: DownloadDocketEntryRequestType,
) => {
  return post({
    applicationContext,
    body: params,
    endpoint: '/async/case-documents/batch-download',
  });
};
