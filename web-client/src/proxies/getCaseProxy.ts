import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';
import { get } from './requests';
import { PublicCaseDTO } from '@shared/business/dto/cases/PublicCaseDTO';
import { RestrictedCaseDTO } from '@shared/business/dto/cases/RestrictedCaseDTO';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getCaseInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber },
): Promise<CaseDTO | RestrictedCaseDTO | PublicCaseDTO> => {
  return get({
    applicationContext,
    endpoint: `/cases/${docketNumber}`,
  });
};
