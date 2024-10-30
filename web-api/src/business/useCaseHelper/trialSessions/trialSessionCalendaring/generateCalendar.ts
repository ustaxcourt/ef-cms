import {
  CalendaringConfig,
  ScheduledTrialSession,
} from './createProspectiveTrialSessions';
import { CaseCountsAndSessionsByCity } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/getDataForCalendaring';
import {
  Constraint,
  checkConstraints,
} from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/constraints';
import {
  FORMATS,
  createDateAtStartOfWeekEST,
} from '@shared/business/utilities/DateHandler';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import {
  SESSION_TYPES,
  TRIAL_CITY_STRINGS,
} from '@shared/business/entities/EntityConstants';
import { SessionCountByWeek } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/assignSessionsToWeeks';
import {
  WASHINGTON_DC_NORTH_STRING,
  WASHINGTON_DC_SOUTH_STRING,
  WASHINGTON_DC_STRING,
  sortObjectByKey,
} from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';

export type CalendarState = {
  sessionCountPerWeek: Record<string, number>;
  sessionScheduledPerCityPerWeek: Record<string, Set<string>>;
  reservedWeekOfLocationIntersection: Record<string, string[]>;
  sessionCountPerCity: Record<string, number>;
};

export const generateCalendar = ({
  calendaringConfig,
  caseCountsAndSessionsByCity,
  constraints,
  specialSessions,
  weeksToLoop,
}: {
  specialSessions: RawTrialSession[];
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity;
  weeksToLoop: string[];
  constraints: Constraint[];
  calendaringConfig: CalendaringConfig;
}): {
  sessionCountPerWeek: SessionCountByWeek;
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity;
} => {
  const calendarState = setupCalendarState(weeksToLoop);

  sortObjectByKey(caseCountsAndSessionsByCity, (a, b) => {
    const aNotVisited =
      caseCountsAndSessionsByCity[a].prospectiveSessions[0]
        ?.cityWasNotVisitedInLastTwoTerms || false;
    const bNotVisited =
      caseCountsAndSessionsByCity[b].prospectiveSessions[0]
        ?.cityWasNotVisitedInLastTwoTerms || false;

    return aNotVisited === bNotVisited ? 0 : aNotVisited ? -1 : 1;
  });

  // special sessions handled ahead of all reg, small
  specialSessions.forEach(specialSession => {
    const sessionWeekOf = createDateAtStartOfWeekEST(
      specialSession.startDate,
      FORMATS.YYYYMMDD,
    );

    const session: ScheduledTrialSession = {
      sessionType: SESSION_TYPES.special,
      trialLocation: getTrialLocationForSpecialSession({
        calendarState,
        calendaringConfig,
        originalLocation: specialSession.trialLocation!,
        sessionWeekOf,
      }),
      weekOf: sessionWeekOf,
    };

    // eslint-disable-next-line no-useless-catch
    try {
      checkConstraints({
        calendarState,
        calendaringConfig,
        constraints,
        session,
      });
    } catch (e) {
      throw e;
    }

    addScheduledTrialSession({
      calendarState,
      calendaringConfig,
      caseCountsAndSessionsByCity,
      session,
    });

    reserveWeekAfterSpecialSession({
      calendarState,
      session,
      weeksToLoop,
    });
  });

  for (const currentWeek of weeksToLoop) {
    const weekOfString = currentWeek;
    for (const city in caseCountsAndSessionsByCity) {
      for (const prospectiveSession of caseCountsAndSessionsByCity[city]
        .prospectiveSessions) {
        const session: ScheduledTrialSession = {
          sessionType: prospectiveSession.sessionType,
          trialLocation: prospectiveSession.trialLocation,
          weekOf: weekOfString,
        };

        const canScheduleSession = checkConstraints({
          calendarState,
          calendaringConfig,
          constraints,
          session,
        });

        if (canScheduleSession) {
          addScheduledTrialSession({
            calendarState,
            calendaringConfig,
            caseCountsAndSessionsByCity,
            session,
          });

          const index =
            caseCountsAndSessionsByCity[city].prospectiveSessions.indexOf(
              prospectiveSession,
            );

          if (index !== -1) {
            caseCountsAndSessionsByCity[city].prospectiveSessions.splice(
              index,
              1,
            );
          }
        }
      }
    }
  }

  return {
    caseCountsAndSessionsByCity,
    sessionCountPerWeek: calendarState.sessionCountPerWeek,
  };
};

const reserveWeekAfterSpecialSession = ({
  calendarState,
  session,
  weeksToLoop,
}: {
  weeksToLoop: string[];
  calendarState: CalendarState;
  session: ScheduledTrialSession;
}): void => {
  const nextWeekOfString = weeksToLoop[weeksToLoop.indexOf(session.weekOf) + 1];

  if (!calendarState.reservedWeekOfLocationIntersection[nextWeekOfString])
    calendarState.reservedWeekOfLocationIntersection[nextWeekOfString] = [];
  calendarState.reservedWeekOfLocationIntersection[nextWeekOfString].push(
    session.trialLocation,
  );
};

const addScheduledTrialSession = ({
  calendaringConfig,
  calendarState,
  caseCountsAndSessionsByCity,
  session,
}: {
  session: ScheduledTrialSession;
  calendarState: CalendarState;
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity;
  calendaringConfig: CalendaringConfig;
}) => {
  caseCountsAndSessionsByCity[session.trialLocation].scheduledSessions.push(
    session,
  );

  // "intentionally" ignores special sessions
  decrementRemainingCaseCounters(
    session,
    caseCountsAndSessionsByCity,
    calendaringConfig,
  );

  calendarState.sessionCountPerWeek[session.weekOf]++;
  calendarState.sessionCountPerCity[session.trialLocation]++;
  calendarState.sessionScheduledPerCityPerWeek[session.weekOf].add(
    session.trialLocation,
  ); // Mark this city as scheduled for the current week
};

const decrementRemainingCaseCounters = (
  session: ScheduledTrialSession,
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity,
  calendaringConfig: CalendaringConfig,
) => {
  const { sessionType, trialLocation } = session;
  // eslint-disable-next-line spellcheck/spell-checker
  // Decrement by the max count for that session type. If that's less than 0, then we scheduled
  // a session that was more than the min and less than the max, so just set it to 0
  if (sessionType === SESSION_TYPES.regular) {
    caseCountsAndSessionsByCity[trialLocation].remainingRegularCases -=
      calendaringConfig.regularCaseMaxQuantity;
    if (caseCountsAndSessionsByCity[trialLocation].remainingRegularCases < 0)
      caseCountsAndSessionsByCity[trialLocation].remainingRegularCases = 0;
  } else if (sessionType === SESSION_TYPES.small) {
    caseCountsAndSessionsByCity[trialLocation].remainingSmallCases -=
      calendaringConfig.smallCaseMaxQuantity;
    if (caseCountsAndSessionsByCity[trialLocation].remainingSmallCases < 0)
      caseCountsAndSessionsByCity[trialLocation].remainingSmallCases = 0;
  } else if (sessionType === SESSION_TYPES.hybrid) {
    caseCountsAndSessionsByCity[trialLocation].remainingRegularCases = 0;
    caseCountsAndSessionsByCity[trialLocation].remainingSmallCases = 0;
  }
};

const setupCalendarState = (weeksToLoop: string[]): CalendarState => {
  const calendarState: CalendarState = {
    reservedWeekOfLocationIntersection: {},
    sessionCountPerCity: {},
    sessionCountPerWeek: {},
    sessionScheduledPerCityPerWeek: {},
  };

  // Initialize session counts
  weeksToLoop.forEach(week => {
    calendarState.sessionCountPerWeek[week] = 0;
    calendarState.sessionScheduledPerCityPerWeek[week] = new Set();
  });

  TRIAL_CITY_STRINGS.forEach(cityStringKey => {
    if (cityStringKey === WASHINGTON_DC_STRING) {
      calendarState.sessionCountPerCity[WASHINGTON_DC_NORTH_STRING] = 0;
      calendarState.sessionCountPerCity[WASHINGTON_DC_SOUTH_STRING] = 0;
    } else {
      calendarState.sessionCountPerCity[cityStringKey] = 0;
    }
  });

  return calendarState;
};

const getTrialLocationForSpecialSession = ({
  calendaringConfig,
  calendarState,
  originalLocation,
  sessionWeekOf,
}: {
  calendaringConfig: CalendaringConfig;
  calendarState: CalendarState;
  sessionWeekOf: string;
  originalLocation: string;
}): string => {
  let resultTrialLocation = originalLocation;

  if (originalLocation === WASHINGTON_DC_STRING) {
    if (
      calendarState.sessionCountPerCity[WASHINGTON_DC_NORTH_STRING] >=
        calendaringConfig.maxSessionsPerLocation ||
      calendarState.sessionScheduledPerCityPerWeek[sessionWeekOf].has(
        WASHINGTON_DC_NORTH_STRING,
      )
    ) {
      resultTrialLocation = WASHINGTON_DC_SOUTH_STRING;
    } else {
      resultTrialLocation = WASHINGTON_DC_NORTH_STRING;
    }
  }

  return resultTrialLocation;
};
