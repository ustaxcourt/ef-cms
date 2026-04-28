import { put } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const archiveDraftDocumentInteractor = (
  applicationContext: ClientApplicationContext,
  { docketEntryId, docketNumber },
) => {
  return put({
    applicationContext,
    endpoint: `/case-documents/${docketNumber}/${docketEntryId}`,
  });
};
