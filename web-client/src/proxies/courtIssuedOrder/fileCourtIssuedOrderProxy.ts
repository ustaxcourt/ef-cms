import { asyncSyncHandler, post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const fileCourtIssuedOrderInteractor = (
  applicationContext: ClientApplicationContext,
  { documentMetadata, primaryDocumentFileId },
) => {
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
  );
};
