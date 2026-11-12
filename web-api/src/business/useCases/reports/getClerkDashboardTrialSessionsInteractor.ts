import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import {
  ClerkOfCourtDashboardTrialSessionWeeks,
  getClerkOfCourtDashboardTrialSessionWeeks,
} from '@web-api/business/utilities/getClerkOfCourtDashboardTrialSessionWeeks';
import { getTrialSessionsStartingBetween } from '@web-api/persistence/postgres/trialSessions/getTrialSessionsStartingBetween';

export type ClerkDashboardTrialSessions = {
  trialSessions: TrialSessionInfoDTO[];
  // the weeks the query used, so the client groups the sessions by the same weeks
  weeks?: ClerkOfCourtDashboardTrialSessionWeeks;
};

/**
 * Gets the trial sessions that start in the current week or the next week, for
 * the clerk of court dashboard. The dashboard shows only those two weeks, so it
 * does not need every trial session from getTrialSessionsInteractor.
 */
export const getClerkDashboardTrialSessionsInteractor = async (
  authorizedUser: UnknownAuthUser,
): Promise<ClerkDashboardTrialSessions> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const weeks = getClerkOfCourtDashboardTrialSessionWeeks();
  if (!weeks) {
    return { trialSessions: [] };
  }

  const trialSessions = await getTrialSessionsStartingBetween({
    begin: weeks.currentWeekStart,
    end: weeks.nextWeekEnd,
  });

  return {
    trialSessions: trialSessions
      .map(trialSession => new TrialSession(trialSession).toRawObject())
      .map(trialSession => new TrialSessionInfoDTO(trialSession)),
    weeks,
  };
};
