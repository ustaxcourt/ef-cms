import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { TrialSession } from '../../entities/trialSessions/TrialSession';
import { TrialSessionInfoDTO } from '../../dto/trialSessions/TrialSessionInfoDTO';
import { UnauthorizedError } from '@web-api/errors/errors';

export const getTrialSessionsInteractor = async (
  applicationContext: IApplicationContext,
): Promise<TrialSessionInfoDTO[]> => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSessions = await applicationContext
    .getPersistenceGateway()
    .getTrialSessions({
      applicationContext,
    });

  const validatedSessions = TrialSession.validateRawCollection(trialSessions, {
    applicationContext,
  });

  return validatedSessions.map(
    trialSession => new TrialSessionInfoDTO(trialSession),
  );
};
