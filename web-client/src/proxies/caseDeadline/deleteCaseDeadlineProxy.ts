import { asyncSyncHandler, remove } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const deleteCaseDeadlineInteractor = (
  applicationContext: ClientApplicationContext,
  { caseDeadlineId, docketNumber },
) => {
  return asyncSyncHandler(
    applicationContext,
    async asyncSyncId =>
      await remove({
        applicationContext,
        asyncSyncId,
        endpoint: `/async/case-deadlines/${docketNumber}/${caseDeadlineId}`,
      }),
  );
};
