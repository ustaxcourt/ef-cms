import { post } from './requests';

export const updateDocketEntriesInteractor = (
  applicationContext,
  {
    docketEntryId,
    docketNumber,
    updatedDocketEntryData,
  }: {
    docketEntryId: string;
    docketNumber: string;
    updatedDocketEntryData: {
      consolidatedCases: any[];
      numberOfPages;
    };
  },
) => {
  return post({
    applicationContext,
    body: { updatedDocketEntryData },
    endpoint: `/docket-entries/${docketNumber}/${docketEntryId}`,
  });
};
