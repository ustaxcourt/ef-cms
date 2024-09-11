import {
  FORMATS,
  createDateAtStartOfWeekEST,
  getWeeksInRange,
} from '@shared/business/utilities/DateHandler';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import {
  SESSION_TYPES,
  TrialSessionTypes,
} from '@shared/business/entities/EntityConstants';

const sessionCountPerWeek: Record<string, number> = {}; // weekOf -> session count
const sessionScheduledPerCityPerWeek: Record<string, Set<string>> = {}; // weekOf -> Set of cities

export const assignSessionsToWeeks = ({
  calendaringConfig,
  endDate,
  prospectiveSessionsByCity,
  specialSessions,
  startDate,
}: {
  specialSessions: RawTrialSession[];
  prospectiveSessionsByCity: Record<
    string,
    {
      city: string;
      sessionType: TrialSessionTypes;
    }[]
  >;
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
}[] => {
  //   -- Prioritize overridden and special sessions that have already been scheduled
  // -- Max 1 per location per week.
  // -- Max x per week across all locations

  const scheduledSessions: {
    city: string;
    sessionType: TrialSessionTypes;
    weekOf: string;
  }[] = [];
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

    for (const city in prospectiveSessionsByCity) {
      // This is a redundant checks, as we expect the length of the array to have already been trimmed to at most the max
      // before entering this function.
      if (
        prospectiveSessionsByCity[city].length >=
        calendaringConfig.maxSessionsPerLocation
      ) {
        continue;
      }

      for (const prospectiveSession of prospectiveSessionsByCity[city]) {
        // do the thing
        if (
          sessionScheduledPerCityPerWeek[weekOfString].has(
            prospectiveSession.city,
          )
        ) {
          continue; // Skip this city if a session is already scheduled for this week
        }

        addScheduledTrialSession({
          ...prospectiveSession,
          scheduledSessions,
          weekOfString,
        });
      }
    }
  }

  return scheduledSessions;
};

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

// Helper function to get the Monday of the week for a given date
function getMondayOfWeek(date: string): string {
  return createDateAtStartOfWeekEST(date, FORMATS.ISO); // Monday as the first day of the week
}
