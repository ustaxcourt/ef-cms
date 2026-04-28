import { RawWorkItemWithCaseAndDocketEntryInfo } from '@web-api/persistence/postgres/workitems/schema';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getDocumentQCServedForSectionInteractor = (
  applicationContext: ClientApplicationContext,
  { section },
): Promise<RawWorkItemWithCaseAndDocketEntryInfo[]> => {
  return get({
    applicationContext,
    endpoint: `/sections/${section}/document-qc/served`,
  });
};
