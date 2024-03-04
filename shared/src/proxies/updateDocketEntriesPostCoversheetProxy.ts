import { post } from './requests';

export const updateDocketEntriesPostCoversheetInteractor = (
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
      numberOfPages: number;
    };
  },
) => {
  return post({
    applicationContext,
    body: { updatedDocketEntryData },
    endpoint: `/docket-entry/${docketNumber}/${docketEntryId}`,
  });
};
