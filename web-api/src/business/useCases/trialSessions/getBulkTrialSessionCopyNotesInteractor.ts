import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import {
  SpecialTrialSession,
  TrialSessionWorkingCopyNotes,
} from '@shared/business/entities/trialSessions/SpecialTrialSessions';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getTrialSessionWorkingCopies } from '@web-api/persistence/postgres/trialSessions/getTrialSessionWorkingCopies';

export const getBulkTrialSessionCopyNotesInteractor = async (
  { specialTrialSessions }: { specialTrialSessions: SpecialTrialSession[] },
  authorizedUser: UnknownAuthUser,
): Promise<Array<TrialSessionWorkingCopyNotes>> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return (
    await getTrialSessionWorkingCopies({
      tsWorkingCopyIds: specialTrialSessions,
    })
  ).map(tswc => ({
    trialSessionId: tswc.trialSessionId,
    sessionNotes: tswc.sessionNotes || '',
  }));
};
