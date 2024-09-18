import {
  SESSION_STATUS_TYPES,
  SESSION_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { assignSessionsToWeeks } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/assignSessionsToWeeks';
import { createProspectiveTrialSessions } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/createProspectiveTrialSessions';

// Maximum of 6 sessions per week overall.
const MAX_SESSIONS_PER_WEEK = 6;

// Maximum of 5 total sessions per location during a term.
const MAX_SESSIONS_PER_LOCATION = 5;

// Regular Cases:
// Minimum of 40 cases to create a session.
// Maximum of 100 cases per session.
const REGULAR_CASE_MINIMUM_QUANTITY = 40;
const REGULAR_CASE_MAX_QUANTITY = 100;

// Small Cases:
// Minimum of 40 cases to create a session.
// Maximum of 125 cases per session.
const SMALL_CASE_MINIMUM_QUANTITY = 40;
const SMALL_CASE_MAX_QUANTITY = 125;

// Hybrid Sessions:
// If neither Small nor Regular categories alone meet the session minimum,
// combine them to reach a minimum of 50 cases.
// Maximum of 100 cases per hybrid session.
const HYBRID_CASE_MINIMUM_QUANTITY = 50;
const HYBRID_CASE_MAX_QUANTITY = 100;

// NOTE: will front-load term with trial sessions, and prioritize Regular > Small > Hybrid

export type TrialSessionReadyForCalendaring = TrialSession & { weekOf: string };

export const generateSuggestedTrialSessionCalendarInteractor = async (
  applicationContext: ServerApplicationContext,
  { endDate, startDate }: { endDate: string; startDate: string },
) => {
  //
  // Maximum of 6 sessions per week
  // Maximum of 5 sessions total per location
  // Regular: 40 regular cases minimum to create a session and a maximum of 100 per session
  // Small: 40 small cases minimum to create a session and a maximum of 125 per session
  // Hybrid: After Small and Regular sessions are created, if small and regular cases can be added together to meet a minimum of 50, create a hybrid session. Maximum will be 100 cases per session
  // Special sessions already created will be automatically included
  // If there has been no trial in the last two terms for a location, then add a session if there are any cases. (ignore the minimum rule)
  //
  const calendaringConfig = {
    hybridCaseMaxQuantity: HYBRID_CASE_MAX_QUANTITY,
    hybridCaseMinimumQuantity: HYBRID_CASE_MINIMUM_QUANTITY,
    maxSessionsPerLocation: MAX_SESSIONS_PER_LOCATION,
    maxSessionsPerWeek: MAX_SESSIONS_PER_WEEK,
    regularCaseMaxQuantity: REGULAR_CASE_MAX_QUANTITY,
    regularCaseMinimumQuantity: REGULAR_CASE_MINIMUM_QUANTITY,
    smallCaseMaxQuantity: SMALL_CASE_MAX_QUANTITY,
    smallCaseMinimumQuantity: SMALL_CASE_MINIMUM_QUANTITY,
  };

  const cases = await applicationContext
    .getPersistenceGateway()
    .getReadyForTrialCases({ applicationContext });

  const sessions = await applicationContext
    .getPersistenceGateway()
    .getTrialSessions({ applicationContext });

  const specialSessions = sessions.filter(session => {
    return (
      session.sessionType === SESSION_TYPES.special &&
      session.isCalendared &&
      session.sessionStatus !== SESSION_STATUS_TYPES.closed
    );
  });

  const prospectiveSessionsByCity = createProspectiveTrialSessions({
    calendaringConfig,
    cases,
  });

  const scheduledTrialSessions = assignSessionsToWeeks({
    calendaringConfig,
    endDate,
    prospectiveSessionsByCity,
    specialSessions,
    startDate,
  });

  return scheduledTrialSessions;
};
