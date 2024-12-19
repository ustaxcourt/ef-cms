import { CalendarState } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/generateCalendar';
import {
  CalendaringConfig,
  ScheduledTrialSession,
} from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/createProspectiveTrialSessions';
import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
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
}) => boolean | string;

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
}): (boolean | string)[] => {
  return constraints.map(c =>
    c({
      calendarState,
      calendaringConfig,
      session: scheduledTrialSession,
    }),
  );
};

export const reservedWeekOfAtLocationConstraint: Constraint = ({
  calendarState,
  session,
}) => {
  return !calendarState.reservedWeekOfLocationIntersection[
    session.weekOf
  ]?.includes(session.trialLocation);
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
    return `More special sessions than maximum allowed per week: ${formatDateString(session.weekOf, FORMATS.MD)} \n`;
  }

  return meetsConstraint;
};

export const oneSessionPerLocationPerWeekConstraint: Constraint = ({
  calendarState,
  session,
}) => {
  // this condition is handled by washingtonDcSpecialConstraint
  if (
    session.sessionType === SESSION_TYPES.special &&
    session.trialLocation === WASHINGTON_DC_SOUTH_STRING
  ) {
    return true;
  }

  const meetsConstraint = !calendarState.sessionScheduledPerCityPerWeek[
    session.weekOf
  ].has(session.trialLocation);

  if (!meetsConstraint && session.sessionType === SESSION_TYPES.special) {
    return `More than one special trial per week scheduled: ${session.trialLocation}, ${formatDateString(session.weekOf, FORMATS.MD)}. \n`;
  }

  return meetsConstraint;
};

export const maxSessionsPerLocationConstraint: Constraint = ({
  calendaringConfig,
  calendarState,
  session,
}) => {
  // this condition is handled by washingtonDcSpecialConstraint
  if (
    session.sessionType === SESSION_TYPES.special &&
    session.trialLocation === WASHINGTON_DC_SOUTH_STRING
  ) {
    return true;
  }

  const meetsConstraint =
    calendarState.sessionCountPerCity[session.trialLocation] <
    calendaringConfig.maxSessionsPerLocation;

  if (!meetsConstraint && session.sessionType === SESSION_TYPES.special) {
    return `More special sessions than maximum allowed per location scheduled: ${session.trialLocation}. \n`;
  }

  return meetsConstraint;
};

export const washingtonDcSpecialConstraint: Constraint = ({
  calendaringConfig,
  calendarState,
  session,
}) => {
  if (
    session.sessionType !== SESSION_TYPES.special ||
    session.trialLocation !== WASHINGTON_DC_SOUTH_STRING
  ) {
    return true;
  }

  if (
    calendarState.sessionScheduledPerCityPerWeek[session.weekOf].has(
      WASHINGTON_DC_SOUTH_STRING,
    )
  ) {
    return `More than two special trial sessions per week: ${WASHINGTON_DC_STRING} ${formatDateString(session.weekOf, FORMATS.MD)}. \n`;
  }

  if (
    calendarState.sessionCountPerCity[WASHINGTON_DC_SOUTH_STRING] >=
    calendaringConfig.maxSessionsPerLocation
  ) {
    return `More special sessions than maximum allowed per location scheduled: ${WASHINGTON_DC_STRING}. \n`;
  }

  return true;
};
