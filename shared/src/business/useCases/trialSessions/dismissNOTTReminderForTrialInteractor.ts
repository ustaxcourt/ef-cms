import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { TrialSession } from '../../entities/trialSessions/TrialSession';
import { UnauthorizedError } from '../../../errors/errors';

/**
 * dismissNOTTReminderForTrialInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.trialSessionId the trial session ID
 */
export const dismissNOTTReminderForTrialInteractor = async (
  applicationContext: IApplicationContext,
  { trialSessionId },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.DIMISS_NOTT_REMINDER)) {
    throw new UnauthorizedError('Unauthorized to dismiss NOTT reminder');
  }

  const currentTrialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  const updatedTrialSessionEntity = new TrialSession(
    { ...currentTrialSession, dismissedAlertForNOTT: true },
    {
      applicationContext,
    },
  );

  await applicationContext.getPersistenceGateway().updateTrialSession({
    applicationContext,
    trialSessionToUpdate: updatedTrialSessionEntity.validate().toRawObject(),
  });

  // await applicationContext.getNotificationGateway().sendNotificationToUser({
  //   applicationContext,
  //   message: {
  //     action: 'update_trial_session_complete',
  //     isDismissingThirtyDayAlert: true,
  //     trialSessionId,
  //   },
  //   userId: user.userId,
  // });
};
