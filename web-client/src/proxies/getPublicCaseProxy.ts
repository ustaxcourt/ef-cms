import { RestrictedCaseResponse } from '@shared/business/dto/cases/RestrictedCaseResponse';
import { get } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { PublicCaseResponse } from '@shared/business/dto/cases/PublicCaseResponse';

export const getPublicCaseInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber },
): Promise<PublicCaseResponse | RestrictedCaseResponse> => {
  return get({
    applicationContext,
    endpoint: `/public-api/cases/${docketNumber}`,
    params: { excludeDocketEntries: true },
  });
};
