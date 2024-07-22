import { NotFoundError } from '../../../errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '../../../../../shared/src/business/entities/authUser/AuthUser';

/**
 * dismissNOTTReminderForTrialInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.trialSessionId the trial session ID
 */
export const dismissNOTTReminderForTrialInteractor = async (
  applicationContext: ServerApplicationContext,
  { trialSessionId }: { trialSessionId: string },
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.DISMISS_NOTT_REMINDER)) {
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

  const updatedTrialSessionEntity: TrialSession = new TrialSession({
    ...currentTrialSession,
    dismissedAlertForNOTT: true,
  });

  await applicationContext.getPersistenceGateway().updateTrialSession({
    applicationContext,
    trialSessionToUpdate: updatedTrialSessionEntity.validate().toRawObject(),
  });
};
