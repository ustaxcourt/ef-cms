import { asyncSyncHandler, post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const fileCourtIssuedOrderInteractor = (
  applicationContext: ClientApplicationContext,
  { documentMetadata, primaryDocumentFileId },
): Promise<CaseDTO> => {
  const { docketNumber } = documentMetadata;
  return asyncSyncHandler(
    applicationContext,
    async asyncSyncId =>
      await post({
        applicationContext,
        asyncSyncId,
        body: {
          documentMetadata,
          primaryDocumentFileId,
        },
        endpoint: `/async/case-documents/${docketNumber}/court-issued-order`,
      }),
  ) as Promise<CaseDTO>;
};
