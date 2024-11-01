import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import {
  SpecialTrialSession,
  SpecialTrialSessionKey,
  TrialSessionWorkingCopyNotes,
} from '@shared/business/entities/trialSessions/SpeciailTrialSessions';
import { UnauthorizedError } from '@web-api/errors/errors';

export const getBulkTrialSessionCopyNotesInteractor = async (
  applicationContext: ServerApplicationContext,
  { specialTrialSessions }: { specialTrialSessions: SpecialTrialSession[] },
  authorizedUser: AuthUser,
): Promise<Array<TrialSessionWorkingCopyNotes>> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const specialTrialSessionKeys: Array<SpecialTrialSessionKey> =
    specialTrialSessions.map(
      (t: SpecialTrialSession): SpecialTrialSessionKey => ({
        pk: `trial-session-working-copy|${t.trialSessionId}`,
        sk: `user|${t.userId}`,
      }),
    );

  return await applicationContext
    .getPersistenceGateway()
    .getBulkTrialSessionWorkingCopyNotes({
      applicationContext,
      specialTrialSessions: specialTrialSessionKeys,
    });
};
