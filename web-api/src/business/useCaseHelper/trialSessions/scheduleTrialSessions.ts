import {
  EligibleCase,
  createProspectiveTrialSessions,
} from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/createProspectiveTrialSessions';
import {
  RawTrialSession,
  TrialSession,
} from '@shared/business/entities/trialSessions/TrialSession';
import { TrialSessionTypes } from '../../../../../shared/src/business/entities/EntityConstants';
import { assignSessionsToWeeks } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/assignSessionsToWeeks';

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

export function scheduleTrialSessions({
  calendaringConfig = {
    hybridCaseMaxQuantity: HYBRID_CASE_MAX_QUANTITY,
    hybridCaseMinimumQuantity: HYBRID_CASE_MINIMUM_QUANTITY,
    maxSessionsPerLocation: MAX_SESSIONS_PER_LOCATION,
    maxSessionsPerWeek: MAX_SESSIONS_PER_WEEK,
    regularCaseMaxQuantity: REGULAR_CASE_MAX_QUANTITY,
    regularCaseMinimumQuantity: REGULAR_CASE_MINIMUM_QUANTITY,
    smallCaseMaxQuantity: SMALL_CASE_MAX_QUANTITY,
    smallCaseMinimumQuantity: SMALL_CASE_MINIMUM_QUANTITY,
  },
  cases,
  endDate,
  specialSessions,
  startDate,
}: {
  cases: EligibleCase[];
  specialSessions: RawTrialSession[];
  endDate: string;
  startDate: string;
  calendaringConfig: {
    maxSessionsPerWeek: number;
    maxSessionsPerLocation: number;
    regularCaseMinimumQuantity: number;
    regularCaseMaxQuantity: number;
    smallCaseMinimumQuantity: number;
    smallCaseMaxQuantity: number;
    hybridCaseMaxQuantity: number;
    hybridCaseMinimumQuantity: number;
  };
}): {
  city: string;
  sessionType: TrialSessionTypes;
  weekOf: string;
}[] {
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
}
