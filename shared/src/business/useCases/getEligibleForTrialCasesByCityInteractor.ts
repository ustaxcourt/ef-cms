import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import {
  UnknownAuthUser,
  isAuthUser,
} from '@shared/business/entities/authUser/AuthUser';
import { getEligibleForTrialCasesByCity } from '@web-api/persistence/postgres/cases/getEligibleTrialCasesForCity';

export const getEligibleForTrialCasesByCityInteractor = async (
  applicationContext: ServerApplicationContext,
  { trialCity }: { trialCity: string },
  authorizedUser: UnknownAuthUser,
): Promise<RawCase[] | undefined> => {
  if (!isAuthUser(authorizedUser)) {
    throw new UnauthorizedError(
      `Invalid User attempting to view eligible cases for: ${trialCity}`,
    );
  }

  return await getEligibleForTrialCasesByCity({
    trialCity,
  });
};
