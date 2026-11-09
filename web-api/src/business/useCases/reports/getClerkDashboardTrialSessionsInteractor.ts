import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getClerkOfCourtDashboardTrialSessionWeeks } from '@shared/business/utilities/getClerkOfCourtDashboardTrialSessionWeeks';
import { getTrialSessionsStartingBetween } from '@web-api/persistence/postgres/trialSessions/getTrialSessionsStartingBetween';

/**
 * Gets the trial sessions that start in the current week or the next week, for
 * the clerk of court dashboard. The dashboard shows only those two weeks, so it
 * does not need every trial session from getTrialSessionsInteractor.
 */
export const getClerkDashboardTrialSessionsInteractor = async (
  authorizedUser: UnknownAuthUser,
): Promise<TrialSessionInfoDTO[]> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const weeks = getClerkOfCourtDashboardTrialSessionWeeks();
  if (!weeks) {
    return [];
  }

  const trialSessions = await getTrialSessionsStartingBetween({
    begin: weeks.currentWeekStart,
    end: weeks.nextWeekEnd,
  });

  return trialSessions
    .map(trialSession => new TrialSession(trialSession).toRawObject())
    .map(trialSession => new TrialSessionInfoDTO(trialSession));
};
