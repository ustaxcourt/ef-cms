import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';
import { get } from './requests';
import { PublicCaseResponse } from '@shared/business/dto/cases/PublicCaseResponse';
import { RestrictedCaseResponse } from '@shared/business/dto/cases/RestrictedCaseResponse';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getCaseInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber },
): Promise<CaseDTO | RestrictedCaseResponse | PublicCaseResponse> => {
  return get({
    applicationContext,
    endpoint: `/cases/${docketNumber}`,
    params: { excludeDocketEntries: true },
  });
};
