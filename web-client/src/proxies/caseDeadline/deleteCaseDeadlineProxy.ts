import { asyncSyncHandler, remove } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const deleteCaseDeadlineInteractor = (
  applicationContext: ClientApplicationContext,
  { caseDeadlineId, docketNumber },
): Promise<CaseDTO> => {
  return asyncSyncHandler(
    applicationContext,
    async asyncSyncId =>
      await remove({
        applicationContext,
        asyncSyncId,
        endpoint: `/async/case-deadlines/${docketNumber}/${caseDeadlineId}`,
      }),
  ) as Promise<CaseDTO>;
};
