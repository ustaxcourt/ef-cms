import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

/**
 * getBlockedCasesInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.trialLocation the preferredTrialLocation to filter the blocked cases by
 * @returns {object} the case data
 */
export const getBlockedCasesInteractor = async (
  applicationContext: IApplicationContext,
  { trialLocation }: { trialLocation: string },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.BLOCK_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const foundCases = await applicationContext
    .getPersistenceGateway()
    .getBlockedCases({
      applicationContext,
      trialLocation,
    });

  return foundCases;
};
