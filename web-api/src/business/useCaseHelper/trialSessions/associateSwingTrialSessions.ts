import { NotFoundError } from '../../../errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import {
  RawTrialSession,
  TrialSession,
} from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getTrialSessionById } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { updateTrialSession } from '@web-api/persistence/postgres/trialSessions/updateTrialSession';
import { withTransaction } from '@web-api/persistence/postgres/utils/transactions';

export const associateSwingTrialSessions = async (
  {
    swingSessionId,
    trialSessionEntity,
  }: { swingSessionId: string; trialSessionEntity: TrialSession },
  authorizedUser: UnknownAuthUser,
): Promise<RawTrialSession> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const swingTrialSession = await getTrialSessionById({
    trialSessionId: swingSessionId,
  });

  if (!swingTrialSession) {
    throw new NotFoundError(`Trial session ${swingSessionId} was not found.`);
  }

  const swingSessionEntity = new TrialSession(swingTrialSession);

  if (trialSessionEntity.isReporting() || swingSessionEntity.isReporting()) {
    throw new Error('Reporting sessions cannot be linked as swing sessions.');
  }

  trialSessionEntity.setAsSwingSession(swingSessionId);
  swingSessionEntity.setAsSwingSession(trialSessionEntity.trialSessionId);

  trialSessionEntity.validate();

  await withTransaction(async () => {
    await updateTrialSession({
      trialSessionToUpdate: swingSessionEntity.validate().toRawObject(),
    });
  });

  return trialSessionEntity.validate().toRawObject();
};
