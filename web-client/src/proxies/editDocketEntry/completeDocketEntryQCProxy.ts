import { asyncSyncHandler, put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const completeDocketEntryQCInteractor = (
  applicationContext: ClientApplicationContext,
  { entryMetadata },
) => {
  const { docketNumber } = entryMetadata;
  return asyncSyncHandler(
    applicationContext,
    async asyncSyncId =>
      await put({
        applicationContext,
        asyncSyncId,
        body: {
          entryMetadata,
        },
        endpoint: `/async/case-documents/${docketNumber}/docket-entry-complete`,
      }),
  );
};
