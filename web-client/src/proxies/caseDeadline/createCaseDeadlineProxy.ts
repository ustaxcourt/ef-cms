import { asyncSyncHandler, post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const createCaseDeadlineInteractor = (
  applicationContext: ClientApplicationContext,
  { caseDeadline },
): Promise<CaseDTO> => {
  return asyncSyncHandler(
    applicationContext,
    async asyncSyncId =>
      await post({
        applicationContext,
        asyncSyncId,
        body: { caseDeadline },
        endpoint: `/async/case-deadlines/${caseDeadline.docketNumber}`,
      }),
  ) as Promise<CaseDTO>;
};
