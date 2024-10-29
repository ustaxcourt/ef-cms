import {
  CalendaringConfig,
  ScheduledTrialSession,
} from './createProspectiveTrialSessions';
import { CaseCountsAndSessionsByCity } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/getDataForCalendaring';
import { Constraint } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/constraints';
import {
  FORMATS,
  createDateAtStartOfWeekEST,
} from '@shared/business/utilities/DateHandler';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import {
  SESSION_TYPES,
  TRIAL_CITY_STRINGS,
} from '@shared/business/entities/EntityConstants';
import {
  SessionCountByWeek,
  TrialSessionsByCity,
} from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/assignSessionsToWeeks';
import {
  WASHINGTON_DC_NORTH_STRING,
  WASHINGTON_DC_SOUTH_STRING,
  WASHINGTON_DC_STRING,
} from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';

export type CalendarState = {
  sessionCountPerWeek: Record<string, number>;
  sessionScheduledPerCityPerWeek: Record<string, Set<string>>;
  reservedWeekOfLocationIntersection: Record<string, string[]>;
  scheduledTrialSessionsByCity: TrialSessionsByCity;
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
  scheduledTrialSessionsByCity: TrialSessionsByCity;
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity;
} => {
  const calendarState = setupCalendarState(weeksToLoop);

  // check special sessions
  // const specialSessionsByLocation = specialSessions.reduce((acc, session) => {
  //   if (!acc[session.trialLocation!]) {
  //     acc[session.trialLocation!] = [];
  //   }
  //   acc[session.trialLocation!].push(session);
  //   return acc;
  // }, {});

  // for (const location in specialSessionsByLocation) {
  //   if (
  //     specialSessionsByLocation[location].length >
  //     calendaringConfig.maxSessionsPerLocation
  //   ) {
  //     throw new Error(
  //       `Special session count exceeds the max sessions per location for ${location}`,
  //     );
  //   }
  // }

  // TODO 10275: test this (and be sure it works)
  const sortedProspectiveSessionsByCity: TrialSessionsByCity = Object.keys(
    caseCountsAndSessionsByCity,
  )
    .sort((a, b) => {
      const aNotVisited =
        caseCountsAndSessionsByCity[a].sessions[0]
          ?.cityWasNotVisitedInLastTwoTerms || false;
      const bNotVisited =
        caseCountsAndSessionsByCity[b].sessions[0]
          ?.cityWasNotVisitedInLastTwoTerms || false;

      return aNotVisited === bNotVisited ? 0 : aNotVisited ? -1 : 1;
    })
    .reduce((obj, key) => {
      if (key === WASHINGTON_DC_STRING) {
        obj[WASHINGTON_DC_SOUTH_STRING] = [];

        for (const prospectiveSession of caseCountsAndSessionsByCity[key]
          .sessions) {
          obj[WASHINGTON_DC_SOUTH_STRING].sessions.push({
            ...prospectiveSession,
            city: WASHINGTON_DC_SOUTH_STRING,
          });
        }

        return obj;
      }
      obj[key] = caseCountsAndSessionsByCity[key].sessions;
      return obj;
    }, {});

  // special sessions handled ahead of all reg, small

  specialSessions.forEach(session => {
    const sessionWeekOf = createDateAtStartOfWeekEST(
      session.startDate,
      FORMATS.YYYYMMDD,
    );
    let trialLocation = session.trialLocation!;

    if (trialLocation === WASHINGTON_DC_STRING) {
      if (
        calendarState.sessionCountPerCity[WASHINGTON_DC_NORTH_STRING] >=
          calendaringConfig.maxSessionsPerLocation ||
        calendarState.sessionScheduledPerCityPerWeek[sessionWeekOf].has(
          WASHINGTON_DC_NORTH_STRING,
        )
      ) {
        if (
          calendarState.sessionCountPerCity[WASHINGTON_DC_SOUTH_STRING] >=
          calendaringConfig.maxSessionsPerLocation
        ) {
          throw new Error(
            `Special sessions in ${WASHINGTON_DC_STRING} exceed the maximum allowed`,
          );
        } else if (
          calendarState.sessionScheduledPerCityPerWeek[sessionWeekOf].has(
            WASHINGTON_DC_SOUTH_STRING,
          )
        ) {
          throw new Error(
            'There must be no more than two special trial sessions per week in Washington, DC.',
          );
        } else {
          trialLocation = WASHINGTON_DC_SOUTH_STRING;
        }
      } else {
        trialLocation = WASHINGTON_DC_NORTH_STRING;
      }
    }

    if (
      calendarState.scheduledTrialSessionsByCity[trialLocation].length >
      calendaringConfig.maxSessionsPerLocation
    ) {
      throw new Error(
        `Special session count exceeds the max sessions per location for ${location}`,
      );
    }

    if (
      calendarState.sessionCountPerWeek[sessionWeekOf] >=
      calendaringConfig.maxSessionsPerWeek
    ) {
      throw new Error(
        `Specials sessions for week of ${sessionWeekOf} exceed maximum sessions allowed per week`,
      );
    }

    if (
      calendarState.sessionScheduledPerCityPerWeek[sessionWeekOf].has(
        trialLocation,
      )
    ) {
      throw new Error(
        'There must only be one special trial session per location per week.',
      );
    }

    addScheduledTrialSession({
      calendarState,
      calendaringConfig,
      caseCountsAndSessionsByCity,
      session: {
        city: trialLocation,
        sessionType: SESSION_TYPES.special,
        weekOf: sessionWeekOf,
      },
    });

    // given the sessionWeekOf, find the next week somehow and add it as a key
    // to reservedWeekOfLocationIntersection, then push the trialLocation value
    // to the array keyed to the city
    const nextWeekOfString =
      weeksToLoop[weeksToLoop.indexOf(sessionWeekOf) + 1];
    if (!calendarState.reservedWeekOfLocationIntersection[nextWeekOfString])
      calendarState.reservedWeekOfLocationIntersection[nextWeekOfString] = [];
    calendarState.reservedWeekOfLocationIntersection[nextWeekOfString].push(
      trialLocation,
    );
  });

  for (const currentWeek of weeksToLoop) {
    const weekOfString = currentWeek;
    for (const city in sortedProspectiveSessionsByCity) {
      for (const prospectiveSession of sortedProspectiveSessionsByCity[city]) {
        const proposedSession = {
          city: prospectiveSession.city,
          sessionType: prospectiveSession.sessionType,
          weekOf: weekOfString,
        };
        // ensure every constraint passes, then schedule
        const canScheduleSession = constraints.every(constraint =>
          constraint({
            calendarState,
            calendaringConfig,
            proposedSession,
          }),
        );

        if (canScheduleSession) {
          addScheduledTrialSession({
            calendarState,
            calendaringConfig,
            caseCountsAndSessionsByCity,
            session: proposedSession,
          });

          const index =
            sortedProspectiveSessionsByCity[city].indexOf(prospectiveSession);

          if (index !== -1) {
            sortedProspectiveSessionsByCity[city].splice(index, 1);
          }
        }
      }
    }
  }

  return {
    caseCountsAndSessionsByCity,
    scheduledTrialSessionsByCity: calendarState.scheduledTrialSessionsByCity,
    sessionCountPerWeek: calendarState.sessionCountPerWeek,
  };
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
  calendarState.scheduledTrialSessionsByCity[session.city].push(session);

  decrementRemainingCaseCounters(
    session,
    caseCountsAndSessionsByCity,
    calendaringConfig,
  );

  calendarState.sessionCountPerWeek[session.weekOf]++;
  calendarState.sessionCountPerCity[session.city]++;
  calendarState.sessionScheduledPerCityPerWeek[session.weekOf].add(
    session.city,
  ); // Mark this city as scheduled for the current week
};

const decrementRemainingCaseCounters = (
  session: ScheduledTrialSession,
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity,
  calendaringConfig: CalendaringConfig,
) => {
  const { city, sessionType } = session;
  // eslint-disable-next-line spellcheck/spell-checker
  // Decrement by the max count for that session type. If that's less than 0, then we scheduled
  // a session that was more than the min and less than the max, so just set it to 0
  if (sessionType === SESSION_TYPES.regular) {
    caseCountsAndSessionsByCity[city].remainingRegularCases -=
      calendaringConfig.regularCaseMaxQuantity;
    if (caseCountsAndSessionsByCity[city].remainingRegularCases < 0)
      caseCountsAndSessionsByCity[city].remainingRegularCases = 0;
  } else if (sessionType === SESSION_TYPES.small) {
    caseCountsAndSessionsByCity[city].remainingSmallCases -=
      calendaringConfig.smallCaseMaxQuantity;
    if (caseCountsAndSessionsByCity[city].remainingSmallCases < 0)
      caseCountsAndSessionsByCity[city].remainingSmallCases = 0;
  } else if (sessionType === SESSION_TYPES.hybrid) {
    caseCountsAndSessionsByCity[city].remainingRegularCases = 0;
    caseCountsAndSessionsByCity[city].remainingSmallCases = 0;
  }
};

const setupCalendarState = (weeksToLoop: string[]): CalendarState => {
  const calendarState: CalendarState = {
    reservedWeekOfLocationIntersection: {},
    scheduledTrialSessionsByCity: {},
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
      calendarState.scheduledTrialSessionsByCity[WASHINGTON_DC_NORTH_STRING] =
        [];
      calendarState.sessionCountPerCity[WASHINGTON_DC_SOUTH_STRING] = 0;
      calendarState.scheduledTrialSessionsByCity[WASHINGTON_DC_SOUTH_STRING] =
        [];
    } else {
      calendarState.sessionCountPerCity[cityStringKey] = 0;
      calendarState.scheduledTrialSessionsByCity[cityStringKey] = [];
    }
  });

  return calendarState;
};
