import {
  CalendaringConfig,
  ProspectiveTrialSession,
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
  createISODateString,
} from '@shared/business/utilities/DateHandler';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import {
  SESSION_TYPES,
  TRIAL_CITY_STRINGS,
} from '@shared/business/entities/EntityConstants';
import {
  WASHINGTON_DC_NORTH_STRING,
  WASHINGTON_DC_SOUTH_STRING,
  WASHINGTON_DC_STRING,
} from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';
import { sortObjectByKey } from '@shared/tools/helpers';

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
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity;
  userMessages: string[];
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

  const userMessages: string[] = [];
  // special sessions handled ahead of all reg, small
  specialSessions
    .sort((a, b) => {
      return createISODateString(a.startDate).localeCompare(
        createISODateString(b.startDate),
      );
    })
    .forEach(specialSession => {
      const sessionWeekOf = createDateAtStartOfWeekEST(
        specialSession.startDate,
        FORMATS.YYYYMMDD,
      );

      const scheduledTrialSession: ScheduledTrialSession = {
        sessionType: SESSION_TYPES.special,
        trialLocation: getTrialLocationForSpecialSession({
          calendarState,
          calendaringConfig,
          originalLocation: specialSession.trialLocation!,
          sessionWeekOf,
        }),
        weekOf: sessionWeekOf,
      };

      const messages = checkConstraints({
        calendarState,
        calendaringConfig,
        constraints,
        scheduledTrialSession,
      }).filter(r => {
        return typeof r === 'string';
      });

      /**
       * Any given item in the messages array represents an ignored constraint.
       * For business reasons, not all constraints trigger a formatting change
       * in the resulting spreadsheet: therefore, only two specific categories
       * of ignored constraints will cause the session to have ignoresConstraints
       * set to true.
       */
      messages.forEach(message => {
        if (
          message.startsWith(
            'More than one special trial per week scheduled:',
          ) ||
          message.startsWith('More than two special trial sessions per week:')
        ) {
          scheduledTrialSession.ignoresConstraints = true;
        }
      });

      userMessages.push(...messages);

      addSpecialScheduledTrialSession({
        calendarState,
        caseCountsAndSessionsByCity,
        scheduledTrialSession,
        weeksToLoop,
      });
    });

  for (const currentWeek of weeksToLoop) {
    const weekOfString = currentWeek;
    for (const city in caseCountsAndSessionsByCity) {
      for (const prospectiveSession of caseCountsAndSessionsByCity[city]
        .prospectiveSessions) {
        const scheduledTrialSession: ScheduledTrialSession = {
          sessionType: prospectiveSession.sessionType,
          trialLocation: prospectiveSession.trialLocation,
          weekOf: weekOfString,
        };

        const canScheduleSession = checkConstraints({
          calendarState,
          calendaringConfig,
          constraints,
          scheduledTrialSession,
        }).every(r => {
          return r === true;
        });

        if (canScheduleSession) {
          addNonSpecialTrialSession({
            calendarState,
            calendaringConfig,
            caseCountsAndSessionsByCity,
            prospectiveSession,
            scheduledTrialSession,
          });
        }
      }
    }
  }

  return {
    caseCountsAndSessionsByCity,
    userMessages: [...new Set(userMessages)],
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
  calendarState,
  caseCountsAndSessionsByCity,
  scheduledTrialSession,
}: {
  scheduledTrialSession: ScheduledTrialSession;
  calendarState: CalendarState;
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity;
}) => {
  caseCountsAndSessionsByCity[
    scheduledTrialSession.trialLocation
  ].scheduledSessions.push(scheduledTrialSession);
  calendarState.sessionCountPerWeek[scheduledTrialSession.weekOf]++;
  calendarState.sessionCountPerCity[scheduledTrialSession.trialLocation]++;
  calendarState.sessionScheduledPerCityPerWeek[
    scheduledTrialSession.weekOf
  ].add(scheduledTrialSession.trialLocation); // Mark this city as scheduled for the current week
};

const decrementRemainingCaseCounters = (
  session: ScheduledTrialSession,
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity,
  calendaringConfig: CalendaringConfig,
) => {
  const { sessionType, trialLocation } = session;
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
    // } else if (sessionType === SESSION_TYPES.hybrid) {
    //   caseCountsAndSessionsByCity[trialLocation].remainingRegularCases = 0;
    //   caseCountsAndSessionsByCity[trialLocation].remainingSmallCases = 0;
    // }
  } else if (sessionType === SESSION_TYPES.hybrid) {
    const cityData = caseCountsAndSessionsByCity[trialLocation];
    const { remainingRegularCases, remainingSmallCases } = cityData;

    let toDecrement = calendaringConfig.hybridCaseMaxQuantity;

    if (remainingRegularCases >= remainingSmallCases) {
      const regularDiff = remainingRegularCases - toDecrement;
      if (regularDiff >= 0) {
        caseCountsAndSessionsByCity[trialLocation].remainingRegularCases =
          regularDiff;
      } else {
        caseCountsAndSessionsByCity[trialLocation].remainingRegularCases = 0;
        toDecrement = Math.abs(regularDiff);
        const smallDiff = remainingSmallCases - toDecrement;
        caseCountsAndSessionsByCity[trialLocation].remainingSmallCases =
          smallDiff >= 0 ? smallDiff : 0;
      }
    } else {
      const smallDiff = remainingSmallCases - toDecrement;
      if (smallDiff >= 0) {
        caseCountsAndSessionsByCity[trialLocation].remainingSmallCases =
          smallDiff;
      } else {
        caseCountsAndSessionsByCity[trialLocation].remainingSmallCases = 0;
        toDecrement = Math.abs(smallDiff);
        const regularDiff = remainingRegularCases - toDecrement;
        caseCountsAndSessionsByCity[trialLocation].remainingRegularCases =
          regularDiff >= 0 ? regularDiff : 0;
      }
    }
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

const addSpecialScheduledTrialSession = ({
  calendarState,
  caseCountsAndSessionsByCity,
  scheduledTrialSession,
  weeksToLoop,
}: {
  scheduledTrialSession: ScheduledTrialSession;
  weeksToLoop: string[];
  calendarState: CalendarState;
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity;
}) => {
  addScheduledTrialSession({
    calendarState,
    caseCountsAndSessionsByCity,
    scheduledTrialSession,
  });
  reserveWeekAfterSpecialSession({
    calendarState,
    session: scheduledTrialSession,
    weeksToLoop,
  });
};

const addNonSpecialTrialSession = ({
  calendaringConfig,
  calendarState,
  caseCountsAndSessionsByCity,
  prospectiveSession,
  scheduledTrialSession,
}: {
  prospectiveSession: ProspectiveTrialSession;
  scheduledTrialSession: ScheduledTrialSession;
  calendarState: CalendarState;
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity;
  calendaringConfig: CalendaringConfig;
}) => {
  addScheduledTrialSession({
    calendarState,
    caseCountsAndSessionsByCity,
    scheduledTrialSession,
  });

  decrementRemainingCaseCounters(
    scheduledTrialSession,
    caseCountsAndSessionsByCity,
    calendaringConfig,
  );
  const index =
    caseCountsAndSessionsByCity[
      prospectiveSession.trialLocation
    ].prospectiveSessions.indexOf(prospectiveSession);

  if (index !== -1) {
    caseCountsAndSessionsByCity[
      prospectiveSession.trialLocation
    ].prospectiveSessions.splice(index, 1);
  }
};
