import {
  FORMATS,
  addWeeksToDate,
  calculateDifferenceInDays,
  createDateAtStartOfWeekEST,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import {
  PROCEDURE_TYPES_MAP,
  SESSION_TYPES,
  TrialSessionTypes,
} from '../../../../../shared/src/business/entities/EntityConstants';
import {
  RawTrialSession,
  TrialSession,
} from '@shared/business/entities/trialSessions/TrialSession';

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

export type EligibleCase = Pick<
  RawCase,
  'preferredTrialCity' | 'procedureType'
>;

export type TrialSessionReadyForCalendaring = TrialSession & { weekOf: string };

const sessions: {
  city: string;
  sessionType: TrialSessionTypes;
  weekOf: string;
}[] = [];
const sessionCountPerWeek: Record<string, number> = {}; // weekOf -> session count
const sessionCountPerCity: Record<string, number> = {}; // city -> session count
const sessionScheduledPerCityPerWeek: Record<string, Set<string>> = {}; // weekOf -> Set of cities

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
  let currentWeek = getMondayOfWeek(startDate);

  let differenceInDays = calculateDifferenceInDays(
    formatDateString(endDate, FORMATS.ISO),
    formatDateString(currentWeek, FORMATS.ISO),
  );

  while (differenceInDays > 0) {
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
      addTrialSession({
        cases: session.caseOrder,
        city: session.trialLocation,
        sessionType: SESSION_TYPES.special,
        weekOfString,
      });
    });

    const potentialTrialLocations: Set<string> = new Set();

    const regularCasesByCity = cases
      .filter(c => c.procedureType === PROCEDURE_TYPES_MAP.regular)
      .reduce((acc, currentCase) => {
        if (!acc[currentCase.preferredTrialCity!]) {
          acc[currentCase.preferredTrialCity!] = [];
        }
        potentialTrialLocations.add(currentCase.preferredTrialCity!);
        acc[currentCase.preferredTrialCity!].push(currentCase);

        return acc;
      }, {});

    const smallCasesByCity = cases
      .filter(c => c.procedureType === PROCEDURE_TYPES_MAP.small)
      .reduce((acc, currentCase) => {
        if (!acc[currentCase.preferredTrialCity!]) {
          acc[currentCase.preferredTrialCity!] = [];
        }
        potentialTrialLocations.add(currentCase.preferredTrialCity!);
        acc[currentCase.preferredTrialCity!].push(currentCase);

        return acc;
      }, {});

    for (const city of potentialTrialLocations) {
      if (!sessionCountPerCity[city]) {
        sessionCountPerCity[city] = 0;
      }

      if (sessionScheduledPerCityPerWeek[weekOfString].has(city)) {
        continue; // Skip this city if a session is already scheduled for this week
      }

      if (
        sessionCountPerWeek[weekOfString] <
          calendaringConfig.maxSessionsPerWeek &&
        sessionCountPerCity[city] < calendaringConfig.maxSessionsPerLocation
      ) {
        let regularCaseSliceSize;
        let smallCaseSliceSize;
        let numberOfRegularCasesForCity = regularCasesByCity[city]?.length || 0;
        let numberOfSmallCasesForCity = smallCasesByCity[city]?.length || 0;

        if (
          numberOfRegularCasesForCity >=
            calendaringConfig.regularCaseMinimumQuantity ||
          numberOfSmallCasesForCity >=
            calendaringConfig.smallCaseMinimumQuantity
        ) {
          if (
            numberOfRegularCasesForCity >=
            calendaringConfig.regularCaseMinimumQuantity
          ) {
            regularCaseSliceSize = calendaringConfig.regularCaseMaxQuantity;

            regularCasesByCity[city].splice(0, regularCaseSliceSize);

            addTrialSession({
              city,
              sessionType: SESSION_TYPES.regular,
              weekOfString,
            });

            continue; // Only one session per city per week, so continue to the next city
          }

          if (
            numberOfSmallCasesForCity >=
            calendaringConfig.smallCaseMinimumQuantity
          ) {
            smallCaseSliceSize = calendaringConfig.smallCaseMaxQuantity;

            smallCasesByCity[city].splice(0, smallCaseSliceSize);

            addTrialSession({
              city,
              sessionType: SESSION_TYPES.small,
              weekOfString,
            });

            continue; // Only one session per city per week, so continue to the next city
          }
        }
      }

      // Handle Hybrid Sessions
      const remainingRegularCases = regularCasesByCity[city] || [];
      const remainingSmallCases = smallCasesByCity[city] || [];

      if (
        remainingRegularCases.length + remainingSmallCases.length >=
        calendaringConfig.hybridCaseMinimumQuantity
      ) {
        // Since the min of reg cases is 40, and the min of small cases is 40,
        // and the sum of these two values is below the hybrid case max of 100,
        // we can safely assume that if the combination of remaining regular
        // cases and remaining small cases is above the minimum of 50, we can
        // assign all of those remaining cases to a hybrid session.
        //
        // This comment applies to the if statement's condition, as well as to
        // the setting of regularCasesByCity[city] and smallCasesByCity[city] to
        // empty arrays below.
        regularCasesByCity[city] = [];
        smallCasesByCity[city] = [];

        addTrialSession({
          city,
          sessionType: SESSION_TYPES.hybrid,
          weekOfString,
        });
      }
    }

    currentWeek = addWeeksToDate({ startDate: currentWeek, weeksToAdd: 1 }); // Move to the next week
    differenceInDays = calculateDifferenceInDays(
      formatDateString(endDate, FORMATS.ISO),
      formatDateString(currentWeek, FORMATS.ISO),
    );
  }

  return sessions;
}

// Helper function to get the Monday of the week for a given date
function getMondayOfWeek(date: string): string {
  return createDateAtStartOfWeekEST(date, FORMATS.ISO); // Monday as the first day of the week
}

function addTrialSession({ city, sessionType, weekOfString }) {
  sessions.push({
    city,
    sessionType,
    weekOf: weekOfString,
  });
  sessionCountPerWeek[weekOfString]++;
  sessionCountPerCity[city]++;

  sessionScheduledPerCityPerWeek[weekOfString].add(city); // Mark this city as scheduled for the current week
}
