import { put } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { PublicCaseResponse } from '@shared/business/dto/cases/PublicCaseResponse';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';
import { RestrictedCaseResponse } from '@shared/business/dto/cases/RestrictedCaseResponse';

export const updateContactInteractor = (
  applicationContext: ClientApplicationContext,
  { contactInfo, docketNumber },
): Promise<CaseDTO | PublicCaseResponse | RestrictedCaseResponse> => {
  return put({
    applicationContext,
    body: { contactInfo, docketNumber },
    endpoint: `/case-parties/${docketNumber}/contact`,
  });
};
