import { asyncSyncHandler, post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const appendAmendedPetitionFormInteractor = (
  applicationContext: ClientApplicationContext,
  { documentStorageId },
): Promise<void> => {
  return asyncSyncHandler(
    applicationContext,
    async asyncSyncId =>
      await post({
        applicationContext,
        asyncSyncId,
        endpoint: `/async/case-documents/${documentStorageId}/append-pdf`,
      }),
  ) as Promise<void>;
};
