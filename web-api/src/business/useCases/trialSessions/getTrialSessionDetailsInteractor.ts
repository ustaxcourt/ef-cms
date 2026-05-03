import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import {
  RawTrialSession,
  TrialSession,
} from '@shared/business/entities/trialSessions/TrialSession';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getTrialSessionById } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';

export const getTrialSessionDetailsInteractor = async (
  { trialSessionId }: { trialSessionId: string },
  authorizedUser: UnknownAuthUser,
): Promise<RawTrialSession> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSessionDetails = await getTrialSessionById({
      trialSessionId,
    });

  if (!trialSessionDetails) {
    throw new NotFoundError(`Trial session ${trialSessionId} was not found.`);
  }

  const trialSessionEntity = new TrialSession(trialSessionDetails).validate();

  return trialSessionEntity.toRawObject();
};
