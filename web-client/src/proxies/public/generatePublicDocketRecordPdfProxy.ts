import { RequestApplicationContext, post } from '../requests';

export const generatePublicDocketRecordPdfInteractor = (
  applicationContext: RequestApplicationContext,
  {
    docketNumber,
    docketRecordTableSort,
  }: {
    docketNumber: string;
    docketRecordTableSort: {
      sortField: string;
      sortOrder: string;
    };
  },
) => {
  return post({
    applicationContext,
    body: {
      docketNumber,
      docketRecordTableSort,
    },
    endpoint: `/public-api/cases/${docketNumber}/generate-docket-record`,
  });
};
