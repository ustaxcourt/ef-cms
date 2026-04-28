import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getEligibleCasesForTrialCity } from '@web-api/persistence/postgres/cases/getEligibleCasesForTrialCity';
import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '@shared/authorization/authorizationClientService';
import {
  EligibleCase,
  RawEligibleCase,
} from '@shared/business/entities/cases/EligibleCase';
import { getEligibleCasesWithIsAgedCase } from '@shared/business/useCaseHelper/getEligibleCasesWithIsAgedCase';

export const getEligibleCasesForCityInteractor = async (
  { trialCity }: { trialCity: string },
  authorizedUser: UnknownAuthUser,
): Promise<RawEligibleCase[]> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError(
      `Invalid User attempting to view eligible cases for: ${trialCity}`,
    );
  }

  const eligibleCases = await getEligibleCasesForTrialCity({ trialCity });
  const eligibleCasesWithIsAgedCase =
    getEligibleCasesWithIsAgedCase(eligibleCases);

  return eligibleCasesWithIsAgedCase.map(rawCase =>
    new EligibleCase(rawCase).validate().toRawObject(),
  );
};
