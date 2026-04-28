import { asyncSyncHandler, post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const fileExternalDocumentInteractor = (
  applicationContext: ClientApplicationContext,
  { documentMetadata },
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
        },
        endpoint: `/async/case-documents/${docketNumber}/external-document`,
      }),
  );
};
