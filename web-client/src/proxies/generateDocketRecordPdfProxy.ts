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
): Promise<{
  fileId: string;
  url: string;
}> => {
  return post({
    applicationContext,
    body: {
      docketNumber,
      docketRecordSort,
      docketRecordTableSort,
      includePartyDetail,
      isIndirectlyAssociated,
    },
    endpoint: '/async/docket-record-pdf',
  });
};
