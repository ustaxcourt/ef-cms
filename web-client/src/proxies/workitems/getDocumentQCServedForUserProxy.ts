import { RawWorkItemWithCaseAndDocketEntryInfo } from '@web-api/persistence/postgres/workitems/schema';
import { get } from '../requests';

export const getDocumentQCServedForUserInteractor = (
  applicationContext,
  { userId }: { userId: string },
): Promise<RawWorkItemWithCaseAndDocketEntryInfo[]> => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}/document-qc/served`,
  });
};
