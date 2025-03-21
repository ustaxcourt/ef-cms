import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { BlockedCasesResponse, getBlockedCases } from '@web-api/persistence/elasticsearch/getBlockedCases';

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
): Promise<BlockedCasesResponse> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.BLOCK_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const foundCases = await getBlockedCases({
    trialLocation,
  });

  return foundCases;
};
