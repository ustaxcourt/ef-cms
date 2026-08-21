import { RawCaseDeadline } from '@shared/business/entities/CaseDeadline';
import { asyncSyncHandler, put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const updateCaseDeadlineInteractor = (
  applicationContext: ClientApplicationContext,
  { caseDeadline },
): Promise<RawCaseDeadline> => {
  return asyncSyncHandler(
    applicationContext,
    async asyncSyncId =>
      await put({
        applicationContext,
        body: { caseDeadline },
        asyncSyncId,
        endpoint: `/async/case-deadlines/${caseDeadline.docketNumber}/${caseDeadline.caseDeadlineId}`,
      }),
  ) as Promise<RawCaseDeadline>;
};
