import { get } from '../requests';
import { RawWorkItemWithCaseAndDocketEntryInfo } from '@web-api/persistence/postgres/workitems/schema';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getDocumentQCInboxForUserInteractor = (
  applicationContext: ClientApplicationContext,
  { userId },
): Promise<RawWorkItemWithCaseAndDocketEntryInfo[]> => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}/document-qc/inbox`,
  });
};
