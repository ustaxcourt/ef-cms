import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { TrialSession } from '../../entities/trialSessions/TrialSession';
/**
 * dismissNOTTReminderForTrialInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.trialSessionId the trial session ID
 */
export const dismissNOTTReminderForTrialInteractor = async (
  applicationContext: IApplicationContext,
  { trialSessionId }: { trialSessionId: string },
): Promise<void> => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.DISMISS_NOTT_REMINDER)) {
    throw new UnauthorizedError('Unauthorized to dismiss NOTT reminder');
  }

  const currentTrialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  if (!currentTrialSession) {
    throw new NotFoundError(`Trial session ${trialSessionId} was not found.`);
  }

  const updatedTrialSessionEntity: TrialSession = new TrialSession(
    { ...currentTrialSession, dismissedAlertForNOTT: true },
    {
      applicationContext,
    },
  );

  await applicationContext.getPersistenceGateway().updateTrialSession({
    applicationContext,
    trialSessionToUpdate: updatedTrialSessionEntity.validate().toRawObject(),
  });
};
