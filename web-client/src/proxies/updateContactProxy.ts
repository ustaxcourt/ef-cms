import { put } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { PublicCaseDTO } from '@shared/business/dto/cases/PublicCaseDTO';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';
import { RestrictedCaseDTO } from '@shared/business/dto/cases/RestrictedCaseDTO';

export const updateContactInteractor = (
  applicationContext: ClientApplicationContext,
  { contactInfo, docketNumber },
): Promise<CaseDTO | PublicCaseDTO | RestrictedCaseDTO> => {
  return put({
    applicationContext,
    body: { contactInfo, docketNumber },
    endpoint: `/case-parties/${docketNumber}/contact`,
  });
};
