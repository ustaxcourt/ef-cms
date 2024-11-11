import { CalendarState } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/generateCalendar';
import {
  CalendaringConfig,
  ScheduledTrialSession,
} from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/createProspectiveTrialSessions';
import { SESSION_TYPES } from '@shared/business/entities/EntityConstants';
import {
  WASHINGTON_DC_SOUTH_STRING,
  WASHINGTON_DC_STRING,
} from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';

export type Constraint = ({
  calendaringConfig,
  calendarState,
  session,
}: {
  calendarState: CalendarState;
  session: ScheduledTrialSession;
  calendaringConfig: CalendaringConfig;
}) => boolean;

export const checkConstraints = ({
  calendaringConfig,
  calendarState,
  constraints,
  scheduledTrialSession,
}: {
  calendaringConfig: CalendaringConfig;
  calendarState: CalendarState;
  scheduledTrialSession: ScheduledTrialSession;
  constraints: Constraint[];
}): boolean => {
  return constraints.every(c =>
    c({
      calendarState,
      calendaringConfig,
      session: scheduledTrialSession,
    }),
  );
};

export const maxSessionsPerWeekConstraint: Constraint = ({
  calendaringConfig,
  calendarState,
  session,
}) => {
  const meetsConstraint =
    calendarState.sessionCountPerWeek[session.weekOf] <
    calendaringConfig.maxSessionsPerWeek;

  if (!meetsConstraint && session.sessionType === SESSION_TYPES.special) {
    throw new Error(
      `Specials sessions for week of ${session.weekOf} exceed maximum sessions allowed per week.`,
    );
  }

  return meetsConstraint;
};

export const maxSessionsPerLocationConstraint: Constraint = ({
  calendaringConfig,
  calendarState,
  session,
}) => {
  const meetsConstraint =
    calendarState.sessionCountPerCity[session.trialLocation] <
    calendaringConfig.maxSessionsPerLocation;

  if (!meetsConstraint && session.sessionType === SESSION_TYPES.special) {
    throw new Error(
      `Special session count exceeds the max sessions per location for ${session.trialLocation}.`,
    );
  }

  return meetsConstraint;
};

export const oneSessionPerLocationPerWeekConstraint: Constraint = ({
  calendarState,
  session,
}) => {
  const meetsConstraint = !calendarState.sessionScheduledPerCityPerWeek[
    session.weekOf
  ].has(session.trialLocation);

  if (!meetsConstraint && session.sessionType === SESSION_TYPES.special) {
    throw new Error(
      'There must only be one special trial session per location per week.',
    );
  }

  return meetsConstraint;
};

export const reservedWeekOfAtLocationConstraint: Constraint = ({
  calendarState,
  session,
}) => {
  return !calendarState.reservedWeekOfLocationIntersection[
    session.weekOf
  ]?.includes(session.trialLocation);
};

export const washingtonDcSpecialConstraint: Constraint = ({
  calendaringConfig,
  calendarState,
  session,
}) => {
  if (
    session.sessionType !== SESSION_TYPES.special ||
    session.trialLocation !== WASHINGTON_DC_SOUTH_STRING
  )
    return true;

  if (
    calendarState.sessionScheduledPerCityPerWeek[session.weekOf].has(
      WASHINGTON_DC_SOUTH_STRING,
    )
  ) {
    throw new Error(
      'There must be no more than two special trial sessions per week in Washington, DC.',
    );
  }

  if (
    calendarState.sessionCountPerCity[WASHINGTON_DC_SOUTH_STRING] >=
    calendaringConfig.maxSessionsPerLocation
  ) {
    throw new Error(
      `Special sessions in ${WASHINGTON_DC_STRING} exceed the maximum allowed.`,
    );
  }

  return true;
};
