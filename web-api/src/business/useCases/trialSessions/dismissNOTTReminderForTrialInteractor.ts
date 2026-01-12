import { NotFoundError } from '../../../errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getTrialSessionById } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { updateTrialSession } from '@web-api/persistence/postgres/trialSessions/updateTrialSession';

/**
 * dismissNOTTReminderForTrialInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.trialSessionId the trial session ID
 */
export const dismissNOTTReminderForTrialInteractor = async (
  { trialSessionId }: { trialSessionId: string },
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.DISMISS_NOTT_REMINDER)) {
    throw new UnauthorizedError('Unauthorized to dismiss NOTT reminder');
  }

  const currentTrialSession = await getTrialSessionById({
      trialSessionId,
    });

  if (!currentTrialSession) {
    throw new NotFoundError(`Trial session ${trialSessionId} was not found.`);
  }

  const updatedTrialSessionEntity: TrialSession = new TrialSession({
    ...currentTrialSession,
    dismissedAlertForNott: true,
  });

  await updateTrialSession({
    trialSessionToUpdate: updatedTrialSessionEntity.validate().toRawObject(),
  });
};
