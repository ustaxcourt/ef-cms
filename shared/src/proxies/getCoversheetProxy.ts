import { get } from './requests';

export const getCoversheetInteractor = (
  applicationContext,
  {
    docketEntryId,
    docketNumber,
  }: {
    docketNumber: string;
    docketEntryId: string;
  },
) => {
  return get({
    applicationContext,
    endpoint: `/get-coversheet/${docketNumber}/${docketEntryId}`,
  });
};
