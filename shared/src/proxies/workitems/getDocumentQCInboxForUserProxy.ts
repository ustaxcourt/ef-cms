import { get } from '../requests';
import { RawWorkItemWithCaseAndDocketEntryInfo } from '@web-api/persistence/postgres/workitems/schema';

export const getDocumentQCInboxForUserInteractor = (
  applicationContext,
  { userId },
): Promise<RawWorkItemWithCaseAndDocketEntryInfo[]> => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}/document-qc/inbox`,
  });
};
