import { post } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const blockCaseFromTrialInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber, reason },
): Promise<CaseDTO> => {
  return post({
    applicationContext,
    body: { reason },
    endpoint: `/case-meta/${docketNumber}/block`,
  });
};
