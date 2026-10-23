import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import {
  RawTrialSession,
  TrialSession,
} from '@shared/business/entities/trialSessions/TrialSession';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { ALLOWLIST_FEATURE_FLAGS } from '@shared/business/entities/EntityConstants';
import { getFeatureFlagValue } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValue';
import { withTransaction } from '@web-api/persistence/postgres/utils/transactions';

export const createTrialSessionInteractor = async (
  applicationContext: ServerApplicationContext,
  { trialSession }: { trialSession: RawTrialSession },
  authorizedUser: UnknownAuthUser,
): Promise<RawTrialSession> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CREATE_TRIAL_SESSION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSessionToAdd = new TrialSession(trialSession);

  if (trialSessionToAdd.isReporting() && trialSessionToAdd.isCalendared) {
    throw new Error('Reporting sessions require a reporting calendar.');
  }

  if (
    trialSessionToAdd.isReporting() &&
    !(await getFeatureFlagValue<boolean>(
      ALLOWLIST_FEATURE_FLAGS.REPORTING_CALENDARS.key,
    ))
  ) {
    throw new Error('Reporting calendars are not enabled.');
  }

  if (
    ['Motion/Hearing', 'Special'].includes(trialSessionToAdd.sessionType) ||
    trialSessionToAdd.isStandaloneRemote()
  ) {
    trialSessionToAdd.setAsCalendared();
  }

  trialSessionToAdd.validate();

  return await withTransaction(async () => {
    if (trialSessionToAdd.swingSession && trialSessionToAdd.swingSessionId) {
      await applicationContext.getUseCaseHelpers().associateSwingTrialSessions(
        {
          swingSessionId: trialSessionToAdd.swingSessionId,
          trialSessionEntity: trialSessionToAdd,
        },
        authorizedUser,
      );
    }

    return await applicationContext
      .getUseCaseHelpers()
      .createTrialSessionAndWorkingCopy({
        trialSessionToAdd,
      });
  });
};
