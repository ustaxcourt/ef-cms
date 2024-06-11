import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import {
  RawTrialSession,
  TrialSession,
} from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';

/**
 * createTrialSessionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.trialSession the trial session data
 * @returns {object} the created trial session
 */
export const createTrialSessionInteractor = async (
  applicationContext: ServerApplicationContext,
  { trialSession }: { trialSession: RawTrialSession },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.CREATE_TRIAL_SESSION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSessionToAdd = new TrialSession(trialSession, {
    applicationContext,
  });

  if (
    ['Motion/Hearing', 'Special'].includes(trialSessionToAdd.sessionType) ||
    trialSessionToAdd.isStandaloneRemote()
  ) {
    trialSessionToAdd.setAsCalendared();
  }

  if (trialSessionToAdd.swingSession && trialSessionToAdd.swingSessionId) {
    await applicationContext
      .getUseCaseHelpers()
      .associateSwingTrialSessions(applicationContext, {
        swingSessionId: trialSessionToAdd.swingSessionId,
        trialSessionEntity: trialSessionToAdd,
      });
  }

  return await applicationContext
    .getUseCaseHelpers()
    .createTrialSessionAndWorkingCopy({
      applicationContext,
      trialSessionToAdd,
    });
};
