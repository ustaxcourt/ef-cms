import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import {
  SpecialTrialSession,
  TrialSessionWorkingCopyNotes,
} from '@shared/business/entities/trialSessions/SpeciailTrialSessions';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export const getBulkTrialSessionCopyNotesInteractor = async (
  applicationContext: ServerApplicationContext,
  { specialTrialSessions }: { specialTrialSessions: SpecialTrialSession[] },
  authorizedUser: UnknownAuthUser,
): Promise<Array<TrialSessionWorkingCopyNotes>> => {
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
