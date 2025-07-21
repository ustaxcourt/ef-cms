import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getTrialSessions } from '@web-api/persistence/postgres/trialSessions/getTrialSessions';

export const getTrialSessionsInteractor = async (
  applicationContext: ServerApplicationContext,
  authorizedUser: UnknownAuthUser,
): Promise<TrialSessionInfoDTO[]> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSessions = await getTrialSessions();

  return trialSessions
    .map(t => new TrialSession(t).toRawObject())
    .map(trialSession => new TrialSessionInfoDTO(trialSession));
};
