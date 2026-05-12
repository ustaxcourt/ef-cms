import { asyncSyncHandler, post } from './requests';
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
  return asyncSyncHandler(
    applicationContext,
    async asyncSyncId =>
      await post({
        applicationContext,
        asyncSyncId,
        body: {
          docketNumber,
          docketRecordSort,
          docketRecordTableSort,
          includePartyDetail,
          isIndirectlyAssociated,
        },
        endpoint: '/async/docket-record-pdf',
      }),
  ) as Promise<{
    fileId: string;
    url: string;
  }>;
};
