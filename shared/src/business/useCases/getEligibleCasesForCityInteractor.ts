import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getEligibleCasesForTrialCity } from '@web-api/persistence/postgres/cases/getEligibleCasesForTrialCity';
import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '@shared/authorization/authorizationClientService';

export const getEligibleCasesForCityInteractor = async (
  { trialCity }: { trialCity: string },
  authorizedUser: UnknownAuthUser,
): Promise<Omit<RawCase, 'consolidatedCases'>[] | undefined> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError(
      `Invalid User attempting to view eligible cases for: ${trialCity}`,
    );
  }

  return await getEligibleCasesForTrialCity({
    trialCity,
  });
};
