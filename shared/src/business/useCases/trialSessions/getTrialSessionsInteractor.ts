import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { TrialSessionFactory } from '../../entities/trialSessions/TrialSessionFactory';
import { TrialSessionInfoDTO } from '../../dto/trialSessions/TrialSessionInfoDTO';
import { UnauthorizedError } from '../../../errors/errors';

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

  const validatedTrialSessions = trialSessions.map(trialSession =>
    TrialSessionFactory(trialSession, applicationContext)
      .validate()
      .toRawObject(),
  );

  return validatedTrialSessions.map(
    trialSession => new TrialSessionInfoDTO(trialSession),
  );
};
