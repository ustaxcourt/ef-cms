import { asyncSyncHandler, put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const updateDocketEntryMetaInteractor = (
  applicationContext: ClientApplicationContext,
  { docketEntryMeta, docketNumber },
) => {
  return asyncSyncHandler(
    applicationContext,
    async asyncSyncId =>
      await put({
        applicationContext,
        asyncSyncId,
        body: {
          docketEntryMeta,
        },
        endpoint: `/async/case-documents/${docketNumber}/docket-entry-meta`,
      }),
  );
};
