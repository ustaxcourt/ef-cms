import {
  NewTrialSession,
  RawNewTrialSession,
} from '../../entities/trialSessions/NewTrialSession';
import { OpenTrialSession } from '../../entities/trialSessions/OpenTrialSession';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';

export const createTrialSessionInteractor = async (
  applicationContext: IApplicationContext,
  { trialSession }: { trialSession: RawNewTrialSession },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  let trialSessionToAdd: OpenTrialSession | NewTrialSession =
    new NewTrialSession(trialSession, {
      applicationContext,
    });

  if (
    ['Motion/Hearing', 'Special'].includes(trialSessionToAdd.sessionType) ||
    trialSessionToAdd.isStandaloneRemote()
  ) {
    trialSessionToAdd = trialSessionToAdd.setAsCalendared();
  }

  if (trialSessionToAdd.swingSession && trialSessionToAdd.swingSessionId) {
    applicationContext
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
