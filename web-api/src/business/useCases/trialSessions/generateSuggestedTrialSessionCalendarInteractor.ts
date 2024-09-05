import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import {
  PROCEDURE_TYPES_MAP,
  SESSION_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
// One session per location per week.
const MAX_SESSIONS_PER_LOCATION_PER_WEEK = 1; //sessionScheduledPerCityPerWeek
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
export const generateSuggestedTrialSessionCalendarInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    trialTermEndDate,
    trialTermStartDate,
  }: { trialTermEndDate: string; trialTermStartDate: string },
) => {
  // get cases that are ready for trial
  //
  // Maximum of 6 sessions per week
  // Maximum of 5 sessions total per location
  // Regular: 40 regular cases minimum to create a session and a maximum of 100 per session
  // Small: 40 small cases minimum to create a session and a maximum of 125 per session
  // Hybrid: After Small and Regular sessions are created, if small and regular cases can be added together to meet a minimum of 50, create a hybrid session. Maximum will be 100 cases per session
  // Special sessions already created will be automatically included
  // If there has been no trial in the last two terms for a location, then add a session if there are any cases. (ignore the minimum rule)
  //
  // data that has a table
  const input = { endDate: trialTermEndDate, startDate: trialTermStartDate };
  const cases = getCases(); //?
  const specialSessions = getSpecialSessions(); //?

  return scheduleTrialSessions({ cases, input, specialSessions });
};

function scheduleTrialSessions({
  cases,
  input,
  specialSessions,
}: {
  cases: Case[];
  specialSessions: SpecialSession[];
  input: InputForm;
}): TrialSession[] {
  const sessions: TrialSession[] = [];
  const sessionCountPerWeek: Record<string, number> = {}; // weekOf -> session count
  const sessionCountPerCity: Record<string, number> = {}; // city -> session count
  const sessionScheduledPerCityPerWeek: Record<string, Set<string>> = {}; // weekOf -> Set of cities

  let currentWeek = getMondayOfWeek(input.startDate);

  const formattedSpecialSessions = specialSessions.map(session => {
    session.weekOf = getMondayOfWeek(session.startDate);
  });

  while (currentWeek <= input.endDate) {
    const weekOfString = currentWeek.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
    });

    if (!sessionCountPerWeek[weekOfString]) {
      sessionCountPerWeek[weekOfString] = 0;
    }

    if (!sessionScheduledPerCityPerWeek[weekOfString]) {
      sessionScheduledPerCityPerWeek[weekOfString] = new Set();
    }

    const specialSessionsForWeek = formattedSpecialSessions.filter(
      s => s.weekOf === weekOfString,
    );

    specialSessionsForWeek.forEach(session => {
      sessions.push({
        cases: [],
        city: session.city,
        sessionType: 'special',
        weekOf: session.weekOf, // Special sessions cases are handled differently
      });

      sessionCountPerWeek[weekOfString]++;
      sessionCountPerCity[session.city]++;
    });

    const cities = cases.map(c => c.location);

    for (const city of cities) {
      if (!sessionCountPerCity[city]) {
        sessionCountPerCity[city] = 0;
      }

      if (sessionScheduledPerCityPerWeek[weekOfString].has(city)) {
        continue; // Skip this city if a session is already scheduled for this week
      }

      if (
        sessionCountPerWeek[weekOfString] < MAX_SESSIONS_PER_WEEK &&
        sessionCountPerCity[city] < MAX_SESSIONS_PER_LOCATION
      ) {
        // Handle Regular Sessions
        const regularCases = cases.filter(
          c =>
            c.procedureType === PROCEDURE_TYPES_MAP.regular &&
            c.location === city,
        );
        if (regularCases.length >= REGULAR_CASE_MINIMUM_QUANTITY) {
          sessions.push({
            cases: regularCases.slice(0, REGULAR_CASE_MAX_QUANTITY),
            city,
            sessionType: SESSION_TYPES.regular,
            weekOf: weekOfString,
          });
          sessionCountPerWeek[weekOfString]++;
          sessionCountPerCity[city]++;

          sessionScheduledPerCityPerWeek[weekOfString].add(city); // Mark this city as scheduled for the current week
          continue; // Only one session per city per week, so continue to the next city
        }

        // Handle Small Sessions
        const smallCases = cases.filter(
          c =>
            c.procedureType === PROCEDURE_TYPES_MAP.small &&
            c.location === city,
        );
        if (smallCases.length >= SMALL_CASE_MINIMUM_QUANTITY) {
          sessions.push({
            cases: smallCases.slice(0, SMALL_CASE_MAX_QUANTITY),
            city,
            sessionType: SESSION_TYPES.small,
            weekOf: weekOfString,
          });
          sessionCountPerWeek[weekOfString]++;
          sessionCountPerCity[city]++;
        }

        // Handle Hybrid Sessions
        const remainingRegularCases = regularCases.slice(
          REGULAR_CASE_MAX_QUANTITY,
        );
        const remainingSmallCases = smallCases.slice(SMALL_CASE_MAX_QUANTITY);
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
        }
      }
    }

    currentWeek = addWeeks(currentWeek, 1); // Move to the next week
  }

  return sessions;
}
