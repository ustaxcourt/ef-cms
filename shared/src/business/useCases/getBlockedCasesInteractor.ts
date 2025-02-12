import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getBlockedCasesForTrialLocation } from '@web-api/persistence/postgres/cases/reports/getBlockedCasesForTrialLocation';

/**
 * getBlockedCasesInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.trialLocation the preferredTrialLocation to filter the blocked cases by
 * @returns {object} the case data
 */
export const getBlockedCasesInteractor = async (
  { trialLocation }: { trialLocation: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.BLOCK_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const foundCases = await getBlockedCasesForTrialLocation(trialLocation);

  return foundCases;
};
