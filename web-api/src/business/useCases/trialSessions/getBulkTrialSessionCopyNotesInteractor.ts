import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

interface SpecialTrialSession {
  userId: string;
  trialSessionId: string;
}
/**
 * Primary use case for getting multiple special trial session copy notes
 *
 * @param {object} applicationContext
 * @param {object} providers the providers object
 * @param {object} providers.specialTrialSessions array of special trial session & judge ids
 * @param authorizedUser
 */
export const getBulkTrialSessionCopyNotesInteractor = async (
  applicationContext: ServerApplicationContext,
  { specialTrialSessions }: { specialTrialSessions: SpecialTrialSession[] },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const keys = specialTrialSessions.map(t => ({
    pk: `trial-session-working-copy|${t.trialSessionId}`,
    sk: `user|${t.userId}`,
  }));

  return await applicationContext
    .getPersistenceGateway()
    .getBulkTrialSessionWorkingCopies({
      applicationContext,
      specialTrialSessions: keys,
    });
};
