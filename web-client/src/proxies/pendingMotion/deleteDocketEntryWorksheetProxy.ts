import { remove } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const deleteDocketEntryWorksheetInteractor = (
  applicationContext: ClientApplicationContext,
  { docketEntryId },
): Promise<void> => {
  return remove({
    applicationContext,
    endpoint: `/docket-entry/${docketEntryId}/worksheet`,
  });
};
