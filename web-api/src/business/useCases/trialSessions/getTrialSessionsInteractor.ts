import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TrialSessionInfoDTO } from '../../../../../shared/src/business/dto/trialSessions/TrialSessionInfoDTO';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export const getTrialSessionsInteractor = async (
  applicationContext: ServerApplicationContext,
  authorizedUser: UnknownAuthUser,
): Promise<TrialSessionInfoDTO[]> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSessions = await applicationContext
    .getPersistenceGateway()
    .getTrialSessions({
      applicationContext,
    });

  return trialSessions.map(
    trialSession => new TrialSessionInfoDTO(trialSession),
  );
};
