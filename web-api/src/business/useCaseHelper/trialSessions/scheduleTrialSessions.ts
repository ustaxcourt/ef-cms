import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import {
  PROCEDURE_TYPES_MAP,
  SESSION_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';

// use different lib?
import { addWeeks, isWithinInterval, startOfWeek } from 'date-fns';
// One session per location per week.
const MAX_SESSIONS_PER_LOCATION_PER_WEEK = 1; // sessionScheduledPerCityPerWeek
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

export function scheduleTrialSessions({
  cases,
  endDate,
  specialSessions,
  startDate,
}: {
  cases: RawCase[];
  specialSessions: RawTrialSession[];
  endDate: string;
  startDate: string;
}): TrialSession[] {
  const sessions: {}[] = [];
  const sessionCountPerWeek: Record<string, number> = {}; // weekOf -> session count
  const sessionCountPerCity: Record<string, number> = {}; // city -> session count
  const sessionScheduledPerCityPerWeek: Record<string, Set<string>> = {}; // weekOf -> Set of cities

  let currentWeek = getMondayOfWeek(startDate);

  while (currentWeek <= endDate) {
    const weekOfString = currentWeek;

    if (!sessionCountPerWeek[weekOfString]) {
      sessionCountPerWeek[weekOfString] = 0;
    }

    if (!sessionScheduledPerCityPerWeek[weekOfString]) {
      sessionScheduledPerCityPerWeek[weekOfString] = new Set();
    }

    const specialSessionsForWeek = specialSessions.filter(
      s => getMondayOfWeek(s.startDate) === weekOfString,
    );

    specialSessionsForWeek.forEach(session => {
      sessions.push({
        cases: [],
        city: session.trialLocation,
        sessionType: SESSION_TYPES.special,
        weekOf: getMondayOfWeek(session.startDate), // Special sessions cases are handled differently
      });

      sessionCountPerWeek[weekOfString]++;
      sessionCountPerCity[session.trialLocation!]++;
      sessionScheduledPerCityPerWeek[weekOfString];
    });

    // filter instead of preferredTrialCity!?
    const cities: string[] = cases.map(c => c.preferredTrialCity!);

    for (const city of cities) {
      if (!sessionCountPerCity[city]) {
        sessionCountPerCity[city] = 0;
      }

      if (sessionScheduledPerCityPerWeek[weekOfString].has(city)) {
        continue; // Skip this city if a session is already scheduled for this week
      }

      if (
        sessionCountPerWeek[weekOfString] < MAX_SESSIONS_PER_WEEK && // TODO, currently we're going to move to the next city if this limit is reached, and keep checking until we move to the next week.
        sessionCountPerCity[city] < MAX_SESSIONS_PER_LOCATION
      ) {
        const regularCases = cases.filter(
          c =>
            c.procedureType === PROCEDURE_TYPES_MAP.regular &&
            c.preferredTrialCity === city,
        );

        const smallCases = cases.filter(
          c =>
            c.procedureType === PROCEDURE_TYPES_MAP.small &&
            c.preferredTrialCity === city,
        );

        let regularCaseSliceSize;
        let smallCaseSliceSize;

        if (
          regularCases.length >= REGULAR_CASE_MINIMUM_QUANTITY ||
          smallCases.length >= SMALL_CASE_MINIMUM_QUANTITY
        ) {
          if (regularCases.length >= REGULAR_CASE_MINIMUM_QUANTITY) {
            regularCaseSliceSize = REGULAR_CASE_MAX_QUANTITY;
            sessions.push({
              cases: regularCases.slice(0, regularCaseSliceSize),
              city,
              sessionType: SESSION_TYPES.regular,
              weekOf: weekOfString,
            });
            sessionCountPerWeek[weekOfString]++;
            sessionCountPerCity[city]++;

            sessionScheduledPerCityPerWeek[weekOfString].add(city); // Mark this city as scheduled for the current week
            continue; // Only one session per city per week, so continue to the next city
          }

          if (smallCases.length >= SMALL_CASE_MINIMUM_QUANTITY) {
            smallCaseSliceSize = SMALL_CASE_MAX_QUANTITY;
            sessions.push({
              cases: smallCases.slice(0, smallCaseSliceSize),
              city,
              sessionType: SESSION_TYPES.small,
              weekOf: weekOfString,
            });
            sessionCountPerWeek[weekOfString]++;
            sessionCountPerCity[city]++;
            sessionScheduledPerCityPerWeek[weekOfString].add(city); // Mark this city as scheduled for the current week
            continue; // Only one session per city per week, so continue to the next city
          }
        } else {
          regularCaseSliceSize = 0;
          smallCaseSliceSize = 0;
          // Handle Hybrid Sessions
          const remainingRegularCases =
            regularCases.slice(regularCaseSliceSize);
          const remainingSmallCases = smallCases.slice(smallCaseSliceSize);
          if (
            remainingRegularCases.length + remainingSmallCases.length >=
            HYBRID_CASE_MINIMUM_QUANTITY
          ) {
            sessions.push({
              cases: [...remainingRegularCases, ...remainingSmallCases].slice(
                0,
                HYBRID_CASE_MAX_QUANTITY,
              ),
              city,
              sessionType: SESSION_TYPES.hybrid,
              weekOf: weekOfString,
            });
            sessionCountPerWeek[weekOfString]++;
            sessionCountPerCity[city]++;
            sessionScheduledPerCityPerWeek[weekOfString].add(city);
          }
        }
      }
    }
    currentWeek = addWeeks(currentWeek, 1); // Move to the next week
  }
  return sessions;
}

// Helper function to get the Monday of the week for a given date
function getMondayOfWeek(date: string): string {
  return startOfWeek(date, { weekStartsOn: 1 }); // Monday as the first day of the week
}
