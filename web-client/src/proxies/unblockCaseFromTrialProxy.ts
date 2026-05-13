import { remove } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const unblockCaseFromTrialInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber },
): Promise<CaseDTO> => {
  return remove({
    applicationContext,
    endpoint: `/case-meta/${docketNumber}/block`,
  });
};
