import { asyncSyncHandler, post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const validatePdfInteractor = (
  applicationContext: ClientApplicationContext,
  { key }: { key: string },
): Promise<void> => {
  return asyncSyncHandler(
    applicationContext,
    async asyncSyncId =>
      await post({
        applicationContext,
        asyncSyncId,
        endpoint: `/async/documents/${key}/validate`,
      }),
  ) as Promise<void>;
};
