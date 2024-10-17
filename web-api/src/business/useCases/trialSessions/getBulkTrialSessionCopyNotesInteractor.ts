import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

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
  {
    specialTrialSessions,
  }: { specialTrialSessions: { trialSessionId: string; judgeId: string }[] },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  // Add error checking here
  const specialTrialSessionNotes = specialTrialSessions.map(
    async ({ judgeId, trialSessionId }) => {
      return await applicationContext
        .getPersistenceGateway()
        .getTrialSessionWorkingCopy({
          applicationContext,
          trialSessionId,
          userId: judgeId,
        })
        .then(trialSessionWorkingCopy => ({
          sessionNotes: trialSessionWorkingCopy?.sessionNotes || '',
          trialSessionId,
        }));
    },
  );
  return specialTrialSessionNotes;
};
