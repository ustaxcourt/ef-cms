import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const generatePublicDocketRecordPdfInteractor = (
  applicationContext: ClientApplicationContext,
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
