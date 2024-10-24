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
export const getBulkTrialSessionCopyNotesInteractor = (
  applicationContext: ServerApplicationContext,
  { specialTrialSessions }: { specialTrialSessions: SpecialTrialSession[] },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const specialTrialSessionNotes = specialTrialSessions.map(
    async ({ trialSessionId, userId }) => {
      return await applicationContext
        .getPersistenceGateway()
        .getTrialSessionWorkingCopy({
          applicationContext,
          trialSessionId,
          userId,
        })
        .then(trialSessionWorkingCopy => ({
          sessionNotes: trialSessionWorkingCopy?.sessionNotes || '',
          trialSessionId,
        }));
    },
  );

  return Promise.all(specialTrialSessionNotes);
};
