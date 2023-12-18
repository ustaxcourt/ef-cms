import { remove } from '../requests';

export const deleteDocketEntryWorksheetInteractor = (
  applicationContext,
  { docketEntryId },
) => {
  return remove({
    applicationContext,
    endpoint: `/docket-entry/${docketEntryId}/worksheet`,
  });
};
