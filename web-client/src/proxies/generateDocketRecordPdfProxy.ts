import { post } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const generateDocketRecordPdfInteractor = (
  applicationContext: ClientApplicationContext,
  {
    docketNumber,
    docketRecordSort,
    docketRecordTableSort,
    includePartyDetail,
    isIndirectlyAssociated,
  },
) => {
  return post({
    applicationContext,
    body: {
      docketNumber,
      docketRecordSort,
      docketRecordTableSort,
      includePartyDetail,
      isIndirectlyAssociated,
    },
    endpoint: '/api/docket-record-pdf',
  });
};
