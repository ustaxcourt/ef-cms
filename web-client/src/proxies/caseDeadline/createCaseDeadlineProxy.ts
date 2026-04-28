import { asyncSyncHandler, post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const createCaseDeadlineInteractor = (
  applicationContext: ClientApplicationContext,
  { caseDeadline },
) => {
  return asyncSyncHandler(
    applicationContext,
    async asyncSyncId =>
      await post({
        applicationContext,
        asyncSyncId,
        body: { caseDeadline },
        endpoint: `/async/case-deadlines/${caseDeadline.docketNumber}`,
      }),
  );
};
