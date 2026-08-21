import { RestrictedCaseDTO } from '@shared/business/dto/cases/RestrictedCaseDTO';
import { get } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { PublicCaseDTO } from '@shared/business/dto/cases/PublicCaseDTO';

export const getPublicCaseInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber },
): Promise<PublicCaseDTO | RestrictedCaseDTO> => {
  return get({
    applicationContext,
    endpoint: `/public-api/cases/${docketNumber}`,
    params: { excludeDocketEntries: true },
  });
};
