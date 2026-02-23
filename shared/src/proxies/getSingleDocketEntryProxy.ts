import { get } from './requests';

export const getSingleDocketEntryInteractor = (
  applicationContext,
  {
    docketEntryId,
    docketNumber,
  }: { docketEntryId: string; docketNumber: string },
) => {
  return get({
    applicationContext,
    endpoint: `/cases/${docketNumber}/docket-entries/${docketEntryId}`,
  });
};
