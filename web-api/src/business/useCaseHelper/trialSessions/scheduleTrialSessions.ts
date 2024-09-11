import {
  FORMATS,
  addWeeksToDate,
  calculateDifferenceInDays,
  createDateAtStartOfWeekEST,
  formatDateString,
  getWeeksInRange,
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
  console.log('did we get here');
  const prospectiveSessions = createProspectiveTrialSessions({
    calendaringConfig,
    cases,
  });

  const scheduledTrialSessions = assignSessionsToWeeks({
    calendaringConfig,
    endDate,
    prospectiveSessions,
    specialSessions,
    startDate,
  });

  return scheduledTrialSessions;
}

// Helper function to get the Monday of the week for a given date
function getMondayOfWeek(date: string): string {
  return createDateAtStartOfWeekEST(date, FORMATS.ISO); // Monday as the first day of the week
}

function addScheduledTrialSession({
  city,
  scheduledSessions,
  sessionType,
  weekOfString,
}) {
  scheduledSessions.push({
    city,
    sessionType,
    weekOf: weekOfString,
  });
  sessionCountPerWeek[weekOfString]++;
  sessionScheduledPerCityPerWeek[weekOfString].add(city); // Mark this city as scheduled for the current week
}

function addProspectiveTrialSession({
  city,
  prospectiveSessions,
  sessionType,
}) {
  prospectiveSessions.push({
    city,
    sessionType,
  });
  sessionCountPerCity[city]++;
}

function createProspectiveTrialSessions({
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
}: {
  cases: EligibleCase[];
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
}[] {
  let prospectiveSessions: {
    city: string;
    sessionType: TrialSessionTypes;
  }[] = [];
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

    while (
      sessionCountPerCity[city] < calendaringConfig.maxSessionsPerLocation
    ) {
      let regularCaseSliceSize;
      let smallCaseSliceSize;
      // One of these arrays will continue to decrease in size until it is smaller than the other, at which point prioritization below will flip.
      // For now, we are okay with this -- TODO 10275 confirm
      // schedule regular or small
      if (regularCasesByCity[city]?.length > smallCasesByCity[city]?.length) {
        scheduleRegularCases({
          calendaringConfig,
          city,
          prospectiveSessions,
          regularCaseSliceSize,
          regularCasesByCity,
        });
        scheduleSmallCases({
          calendaringConfig,
          city,
          prospectiveSessions,
          smallCaseSliceSize,
          smallCasesByCity,
        });
      } else {
        scheduleSmallCases({
          calendaringConfig,
          city,
          prospectiveSessions,
          smallCaseSliceSize,
          smallCasesByCity,
        });
        scheduleRegularCases({
          calendaringConfig,
          city,
          prospectiveSessions,
          regularCaseSliceSize,
          regularCasesByCity,
        });
      }

      // Handle Hybrid Sessions
      const remainingRegularCases = regularCasesByCity[city] || [];
      const remainingSmallCases = smallCasesByCity[city] || [];

      if (
        remainingRegularCases?.length + remainingSmallCases.length >=
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

        addProspectiveTrialSession({
          city,
          prospectiveSessions,
          sessionType: SESSION_TYPES.hybrid,
        });
      }
    }
  }

  // TODO don't forget we need to deal with overrides.

  return prospectiveSessions;
}

function scheduleRegularCases({
  calendaringConfig,
  city,
  prospectiveSessions,
  regularCasesByCity,
  regularCaseSliceSize,
}) {
  while (
    (regularCasesByCity[city]?.length || 0) >=
    calendaringConfig.regularCaseMinimumQuantity
  ) {
    regularCaseSliceSize = calendaringConfig.regularCaseMaxQuantity;

    regularCasesByCity[city].splice(0, regularCaseSliceSize);

    addProspectiveTrialSession({
      city,
      prospectiveSessions,
      sessionType: SESSION_TYPES.regular,
    });
  }
}

function scheduleSmallCases({
  calendaringConfig,
  city,
  prospectiveSessions,
  smallCasesByCity,
  smallCaseSliceSize,
}) {
  while (
    (smallCasesByCity[city].length || 0) >=
    calendaringConfig.smallCaseMinimumQuantity
  ) {
    smallCaseSliceSize = calendaringConfig.smallCaseMaxQuantity;

    smallCasesByCity[city].splice(0, smallCaseSliceSize);

    addProspectiveTrialSession({
      city,
      prospectiveSessions,
      sessionType: SESSION_TYPES.small,
    });
  }
}

function assignSessionsToWeeks({
  calendaringConfig,
  endDate,
  prospectiveSessions,
  specialSessions,
  startDate,
}: {
  specialSessions: RawTrialSession[];
  prospectiveSessions: {
    city: string;
    sessionType: TrialSessionTypes;
  }[];
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
  //   -- Prioritize overridden and special sessions that have already been scheduled
  // -- Max 1 per location per week.
  // -- Max x per week across all locations

  const scheduledSessions: {
    city: string;
    sessionType: TrialSessionTypes;
    weekOf: string;
  }[] = [];

  const potentialTrialLocations: Set<string> = new Set();
  prospectiveSessions.forEach(prospectiveSession => {
    potentialTrialLocations.add(prospectiveSession.city);
  });

  // Get array of weeks in range to loop through
  const weeksToLoop = getWeeksInRange({ endDate, startDate });

  for (const currentWeek of weeksToLoop) {
    const weekOfString = currentWeek;

    if (!sessionCountPerWeek[weekOfString]) {
      sessionCountPerWeek[weekOfString] = 0;
    }

    if (
      sessionCountPerWeek[weekOfString] >= calendaringConfig.maxSessionsPerWeek
    ) {
      continue;
    }

    if (!sessionScheduledPerCityPerWeek[weekOfString]) {
      sessionScheduledPerCityPerWeek[weekOfString] = new Set();
    }

    const specialSessionsForWeek = specialSessions.filter(
      s => getMondayOfWeek(s.startDate) === weekOfString,
    );

    specialSessionsForWeek.forEach(session => {
      addScheduledTrialSession({
        city: session.trialLocation,
        scheduledSessions,
        sessionType: SESSION_TYPES.special,
        weekOfString,
      });
    });

    for (const prospectiveSession of prospectiveSessions) {
      // do the thing
      if (
        sessionScheduledPerCityPerWeek[weekOfString].has(
          prospectiveSession.city,
        )
      ) {
        continue; // Skip this city if a session is already scheduled for this week
      }

      if (
        sessionCountPerCity[prospectiveSession.city] >=
        calendaringConfig.maxSessionsPerLocation
      ) {
        continue;
      }

      addScheduledTrialSession({
        ...prospectiveSession,
        scheduledSessions,
        weekOfString,
      });
    }
  }

  return scheduledSessions;
}
