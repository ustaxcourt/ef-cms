import { RawWorkItemWithCaseAndDocketEntryInfo } from '@web-api/persistence/postgres/workitems/schema';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getDocumentQCServedForUserInteractor = (
  applicationContext: ClientApplicationContext,
  { userId }: { userId: string },
): Promise<RawWorkItemWithCaseAndDocketEntryInfo[]> => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}/document-qc/served`,
  });
};
