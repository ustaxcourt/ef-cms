import {
  FORMATS,
  createDateAtStartOfWeekEST,
} from '@shared/business/utilities/DateHandler';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import {
  SESSION_TYPES,
  TrialSessionTypes,
} from '@shared/business/entities/EntityConstants';

export type ScheduledTrialSession = {
  city: string;
  sessionType: TrialSessionTypes;
  weekOf: string;
  cityWasNotVisitedInLastTwoTerms: string;
};

export const assignSessionsToWeeks = ({
  calendaringConfig,
  prospectiveSessionsByCity,
  specialSessions,
  weeksToLoop,
}: {
  specialSessions: RawTrialSession[];
  prospectiveSessionsByCity: Record<
    string,
    {
      city: string;
      sessionType: TrialSessionTypes;
    }[]
  >;
  weeksToLoop: string[];
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
  sessionCountPerWeek: Record<string, number>;
  scheduledTrialSessions: ScheduledTrialSession[];
} => {
  const sessionCountPerWeek: Record<string, number> = {}; // weekOf -> session count
  const sessionCountPerCity: Record<string, number> = {}; // trialLocation -> session count
  const sessionScheduledPerCityPerWeek: Record<string, Set<string>> = {}; // weekOf -> Set of cities
  //   -- Prioritize overridden and special sessions that have already been scheduled
  // -- Max 1 per location per week.
  // -- Max x per week across all locations

  const scheduledTrialSessions: {
    city: string;
    sessionType: TrialSessionTypes;
    weekOf: string;
  }[] = [];

  // check special sessions
  const specialSessionsByLocation = specialSessions.reduce((acc, session) => {
    if (!acc[session.trialLocation!]) {
      acc[session.trialLocation!] = [];
    }
    acc[session.trialLocation!].push(session);
    return acc;
  }, {});

  for (const location in specialSessionsByLocation) {
    if (
      specialSessionsByLocation[location].length >
      calendaringConfig.maxSessionsPerLocation
    ) {
      throw new Error(
        `Special session count exceeds the max sessions per location for ${location}`,
      );
    }
  }

  for (const currentWeek of weeksToLoop) {
    // TODO ensure we're scheduling cities that haven't been visited in the last two terms first,
    // so that we guarantee they make it into the suggested term.
    const weekOfString = currentWeek;

    if (!sessionCountPerWeek[weekOfString]) {
      sessionCountPerWeek[weekOfString] = 0;
    }

    if (!sessionScheduledPerCityPerWeek[weekOfString]) {
      sessionScheduledPerCityPerWeek[weekOfString] = new Set();
    }

    const specialSessionsForWeek = specialSessions.filter(s => {
      return (
        createDateAtStartOfWeekEST(s.startDate, FORMATS.YYYYMMDD) ===
        weekOfString
      );
    });

    const specialSessionsForWeekByLocation = specialSessionsForWeek.reduce(
      (acc, session) => {
        if (!acc[session.trialLocation!]) {
          acc[session.trialLocation!] = [];
        }
        acc[session.trialLocation!].push(session);
        return acc;
      },
      {},
    );

    for (const location in specialSessionsForWeekByLocation) {
      if (specialSessionsForWeekByLocation[location].length > 1) {
        throw new Error(
          'There must only be one special trial session per location per week.',
        );
      }
    }

    specialSessionsForWeek.forEach(session => {
      addScheduledTrialSession({
        city: session.trialLocation,
        scheduledTrialSessions,
        sessionCountPerCity,
        sessionCountPerWeek,
        sessionScheduledPerCityPerWeek,
        sessionType: SESSION_TYPES.special,
        weekOfString,
      });
    });

    for (const city in prospectiveSessionsByCity) {
      // This is a redundant check, as we expect the length of the array to have
      // already been trimmed to at most the max before entering this function.
      // since we ignore things beyond the max, force prospective array to at most the max
      if (sessionCountPerCity[city] >= calendaringConfig.maxSessionsPerLocation)
        continue;

      // Check if we're already at the max for this location

      // Just use the first session!
      for (const prospectiveSession of prospectiveSessionsByCity[city]) {
        if (
          sessionScheduledPerCityPerWeek[weekOfString].has(
            prospectiveSession.city,
          ) ||
          sessionCountPerWeek[weekOfString] >=
            calendaringConfig.maxSessionsPerWeek
        ) {
          break; // Skip this city if a session is already scheduled for this week (must allow at most one in this loop)
        }

        addScheduledTrialSession({
          ...prospectiveSession,
          scheduledTrialSessions,
          sessionCountPerCity,
          sessionCountPerWeek,
          sessionScheduledPerCityPerWeek,
          weekOfString,
        });

        const index =
          prospectiveSessionsByCity[city].indexOf(prospectiveSession);
        if (index !== -1) {
          prospectiveSessionsByCity[city].splice(index, 1);
        }
      }
    }
  }

  return { scheduledTrialSessions, sessionCountPerWeek };
};

function addScheduledTrialSession({
  city,
  scheduledTrialSessions,
  sessionCountPerCity,
  sessionCountPerWeek,
  sessionScheduledPerCityPerWeek,
  sessionType,
  weekOfString,
}) {
  if (!sessionCountPerCity[city]) sessionCountPerCity[city] = 0;
  scheduledTrialSessions.push({
    city,
    sessionType,
    weekOf: weekOfString,
  });
  sessionCountPerWeek[weekOfString]++;
  sessionCountPerCity[city]++;
  sessionScheduledPerCityPerWeek[weekOfString].add(city); // Mark this city as scheduled for the current week
}
