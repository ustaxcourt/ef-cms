import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { TrialSession } from '../../entities/trialSessions/TrialSession';
import { TrialSessionInfoDto } from '../../dto/TrialSessionInfoDto';
import { UnauthorizedError } from '../../../errors/errors';

/**
 * getTrialSessionsInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {Array<TrialSession>} the trial sessions returned from persistence
 */
export const getTrialSessionsInteractor = async (
  applicationContext: IApplicationContext,
) => {
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
    trialSession => new TrialSessionInfoDto(trialSession),
  );
};
