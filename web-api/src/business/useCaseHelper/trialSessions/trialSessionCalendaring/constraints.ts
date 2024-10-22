import { CalendarState } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/CalendarGenerator';
import { CalendaringConfig } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/createProspectiveTrialSessions';
import { ScheduledTrialSession } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/assignSessionsToWeeks';

export type Constraint = ({
  calendaringConfig,
  calendarState,
  proposedSession,
}: {
  calendarState: CalendarState;
  proposedSession: ScheduledTrialSession;
  calendaringConfig: CalendaringConfig;
}) => boolean;

export const maxSessionsPerWeekConstraint: Constraint = ({
  calendaringConfig,
  calendarState,
  proposedSession,
}) => {
  return (
    calendarState.sessionCountPerWeek[proposedSession.weekOf] <
    calendaringConfig.maxSessionsPerWeek
  );
};

export const maxSessionsPerLocationConstraint: Constraint = ({
  calendaringConfig,
  calendarState,
  proposedSession,
}) => {
  return (
    calendarState.sessionCountPerCity[proposedSession.city] <
    calendaringConfig.maxSessionsPerLocation
  );
};

export const oneSessionPerLocationPerWeekConstraint: Constraint = ({
  calendarState,
  proposedSession,
}) => {
  return !calendarState.sessionScheduledPerCityPerWeek[
    proposedSession.weekOf
  ].has(proposedSession.city);
};

export const reservedWeekOfAtLocationConstraint: Constraint = ({
  calendarState,
  proposedSession,
}) => {
  return !calendarState.reservedWeekOfLocationIntersection[
    proposedSession.weekOf
  ]?.includes(proposedSession.city);
};
