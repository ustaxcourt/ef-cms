import { asyncSyncHandler, post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const addCoversheetInteractor = (
  applicationContext: ClientApplicationContext,
  { docketEntryId, docketNumber },
) => {
  return asyncSyncHandler(
    applicationContext,
    async asyncSyncId =>
      await post({
        applicationContext,
        asyncSyncId,
        endpoint: `/async/case-documents/${docketNumber}/${docketEntryId}/coversheet`,
      }),
  );
};
