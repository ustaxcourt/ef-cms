import { RawEligibleCase } from '@shared/business/entities/cases/EligibleCase';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import {
  UnknownAuthUser,
  isAuthUser,
} from '@shared/business/entities/authUser/AuthUser';
import { getEligibleForTrialCasesForCity } from '@web-api/persistence/postgres/cases/getEligibleTrialCasesForCity';

export const getEligibleForTrialCasesForCityInteractor = async (
  applicationContext: ServerApplicationContext,
  { trialCity }: { trialCity: string },
  authorizedUser: UnknownAuthUser,
): Promise<RawEligibleCase[] | undefined> => {
  if (!isAuthUser(authorizedUser)) {
    throw new UnauthorizedError(
      `Invalid User attempting to view eligible cases for: ${trialCity}`,
    );
  }

  return await getEligibleForTrialCasesForCity({
    applicationContext,
    trialCity,
  });
};
