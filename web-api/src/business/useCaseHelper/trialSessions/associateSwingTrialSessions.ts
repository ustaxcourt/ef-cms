import { NotFoundError } from '../../../errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import {
  RawTrialSession,
  TrialSession,
} from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export const associateSwingTrialSessions = async (
  applicationContext: ServerApplicationContext,
  {
    swingSessionId,
    trialSessionEntity,
  }: { swingSessionId: string; trialSessionEntity: TrialSession },
  authorizedUser: UnknownAuthUser,
): Promise<RawTrialSession> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const swingTrialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId: swingSessionId,
    });

  if (!swingTrialSession) {
    throw new NotFoundError(`Trial session ${swingSessionId} was not found.`);
  }

  const swingSessionEntity = new TrialSession(swingTrialSession);

  trialSessionEntity.setAsSwingSession(swingSessionId);
  swingSessionEntity.setAsSwingSession(trialSessionEntity.trialSessionId);

  await applicationContext.getPersistenceGateway().updateTrialSession({
    applicationContext,
    trialSessionToUpdate: swingSessionEntity.validate().toRawObject(),
  });

  return trialSessionEntity.validate().toRawObject();
};
