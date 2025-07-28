import { RawWorkItemWithCaseAndDocketEntryInfo } from '@web-api/persistence/postgres/workitems/schema';
import { get } from '../requests';

export const getDocumentQCInboxForUserInteractor = (
  applicationContext,
  { userId },
): Promise<RawWorkItemWithCaseAndDocketEntryInfo[]> => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}/document-qc/inbox`,
  });
};
