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

const sessions: {}[] = [];
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
}): TrialSessionReadyForCalendaring[] {
  let currentWeek = getMondayOfWeek(startDate);

  const differenceInDays = calculateDifferenceInDays(
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
      // TODO: pick up here (maybe move hybrid handling out of while loop?)
      while (
        regularCasesByCity[city]?.length > 0 ||
        smallCasesByCity[city]?.length > 0
      ) {
        if (!sessionCountPerCity[city]) {
          sessionCountPerCity[city] = 0;
        }

        if (sessionScheduledPerCityPerWeek[weekOfString].has(city)) {
          continue; // Skip this city if a session is already scheduled for this week
        }

        if (
          sessionCountPerWeek[weekOfString] <
            calendaringConfig.maxSessionsPerWeek && // TODO, currently we're going to move to the next city if this limit is reached, and keep checking until we move to the next week.
          sessionCountPerCity[city] < calendaringConfig.maxSessionsPerLocation
        ) {
          let regularCaseSliceSize;
          let smallCaseSliceSize;
          let numberOfRegularCasesForCity =
            regularCasesByCity[city]?.length || 0;
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

              const casesToBeAdded = regularCasesByCity[city].splice(
                0,
                regularCaseSliceSize,
              );

              addTrialSession({
                cases: casesToBeAdded,
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

              const casesToBeAdded = smallCasesByCity[city].splice(
                0,
                smallCaseSliceSize,
              );

              addTrialSession({
                cases: casesToBeAdded,
                city,
                sessionType: SESSION_TYPES.small,
                weekOfString,
              });

              continue; // Only one session per city per week, so continue to the next city
            }
          } else {
            // Handle Hybrid Sessions
            const remainingRegularCases = regularCasesByCity[city] || [];
            const remainingSmallCases = smallCasesByCity[city] || [];

            if (
              remainingRegularCases.length + remainingSmallCases.length >=
              calendaringConfig.hybridCaseMinimumQuantity
            ) {
              const casesToBeAdded = [
                ...remainingRegularCases,
                ...remainingSmallCases,
              ].slice(0, calendaringConfig.hybridCaseMaxQuantity);

              addTrialSession({
                cases: casesToBeAdded,
                city,
                sessionType: SESSION_TYPES.hybrid,
                weekOfString,
              });
            }
          }
        }
      }
    }
    console.debug('currentWeek before', currentWeek);
    currentWeek = addWeeksToDate({ startDate: currentWeek, weeksToAdd: 1 }); // Move to the next week
    console.debug('currentWeek after', currentWeek);
  }

  return sessions;
}

// Helper function to get the Monday of the week for a given date
function getMondayOfWeek(date: string): string {
  return createDateAtStartOfWeekEST(date, FORMATS.ISO); // Monday as the first day of the week
}

function addTrialSession({ cases, city, sessionType, weekOfString }) {
  sessions.push({
    cases,
    city,
    sessionType,
    weekOf: weekOfString,
  });
  sessionCountPerWeek[weekOfString]++;
  sessionCountPerCity[city]++;

  sessionScheduledPerCityPerWeek[weekOfString].add(city); // Mark this city as scheduled for the current week
}
