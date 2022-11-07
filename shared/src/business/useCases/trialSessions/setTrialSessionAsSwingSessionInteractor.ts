import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { TrialSession } from '../../entities/trialSessions/TrialSession';
import { UnauthorizedError } from '../../../errors/errors';

/**
 * setTrialSessionAsSwingSessionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.swingSessionId the id of the trial session to add as a swing session
 * @param {string} providers.trialSessionId the trial session to add the swing session to
 * @returns {Promise} the promise of the updateTrialSession call
 */
export const setTrialSessionAsSwingSessionInteractor = async (
  applicationContext: IApplicationContext,
  {
    swingSessionId,
    trialSessionId,
  }: { swingSessionId: string; trialSessionId: string },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  const trialSessionEntity = new TrialSession(trialSession, {
    applicationContext,
  });

  trialSessionEntity.setAsSwingSession(swingSessionId);

  await applicationContext.getPersistenceGateway().updateTrialSession({
    applicationContext,
    trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
  });

  return trialSessionEntity.validate().toRawObject();
};
