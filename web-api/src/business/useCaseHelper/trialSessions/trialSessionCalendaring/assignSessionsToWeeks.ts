import {
  CalendaringConfig,
  ProspectiveSessionsByCity,
} from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/createProspectiveTrialSessions';
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
};

export const assignSessionsToWeeks = ({
  calendaringConfig,
  prospectiveSessionsByCity,
  specialSessions,
  weeksToLoop,
}: {
  specialSessions: RawTrialSession[];
  prospectiveSessionsByCity: ProspectiveSessionsByCity;
  weeksToLoop: string[];
  calendaringConfig: CalendaringConfig;
}): {
  sessionCountPerWeek: Record<string, number>;
  scheduledTrialSessionsByCity: Record<string, ScheduledTrialSession[]>;
} => {
  const sessionCountPerWeek: Record<string, number> = {}; // weekOf -> session count
  const sessionCountPerCity: Record<string, number> = {}; // trialLocation -> session count
  const sessionScheduledPerCityPerWeek: Record<string, Set<string>> = {}; // weekOf -> Set of cities
  //   -- Prioritize overridden and special sessions that have already been scheduled
  // -- Max 1 per location per week.
  // -- Max x per week across all locations

  // const scheduledTrialSessions: ScheduledTrialSession[] = [];
  const scheduledTrialSessionsByCity: Record<string, ScheduledTrialSession[]> =
    {};

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

    let washingtonDc = 'Washington, District of Columbia';
    const washingtonDcNorth = 'Washington, District of Columbia (North)'; // specials only
    const washingtonDcSouth = 'Washington, District of Columbia (South)'; // open for any type

    const specialSessionsForWeekByLocation = specialSessionsForWeek.reduce(
      (acc, session) => {
        if (session.trialLocation === washingtonDc) {
          // assign special to special-only slot (north)
          // if north is occupied, assign to south
          if (!acc[washingtonDcNorth]) {
            acc[washingtonDcNorth] = session;
          } else if (!acc[washingtonDcSouth]) {
            acc[washingtonDcSouth] = session;
          } else {
            throw new Error(
              'There must only be no more than two special trial sessions per week in Washington, DC.',
            );
          }

          return acc;
        }

        if (!acc[session.trialLocation!]) {
          acc[session.trialLocation!] = session;
        } else {
          throw new Error(
            'There must only be one special trial session per location per week.',
          );
        }

        return acc;
      },
      {},
    );

    for (const location in specialSessionsForWeekByLocation) {
      addScheduledTrialSession({
        city: location,
        scheduledTrialSessionsByCity,
        sessionCountPerCity,
        sessionCountPerWeek,
        sessionScheduledPerCityPerWeek,
        sessionType: SESSION_TYPES.special,
        weekOfString,
      });
    }

    // TODO 10275: test this (and be sure it works)
    const sortedProspectiveSessionsByCity = Object.keys(
      prospectiveSessionsByCity,
    )
      .sort((a, b) => {
        const aNotVisited =
          prospectiveSessionsByCity[a][0]?.cityWasNotVisitedInLastTwoTerms ||
          false;
        const bNotVisited =
          prospectiveSessionsByCity[b][0]?.cityWasNotVisitedInLastTwoTerms ||
          false;

        return aNotVisited === bNotVisited ? 0 : aNotVisited ? -1 : 1;
      })
      .reduce((obj, key) => {
        if (key === washingtonDc) {
          obj[washingtonDcSouth] = {
            ...prospectiveSessionsByCity[key],
            city: washingtonDcSouth,
          };
        }
        obj[key] = prospectiveSessionsByCity[key];
        return obj;
      }, {});

    for (const city in sortedProspectiveSessionsByCity) {
      // This is a redundant check, as we expect the length of the array to have
      // already been trimmed to at most the max before entering this function.
      // since we ignore things beyond the max, force prospective array to at most the max
      if (sessionCountPerCity[city] >= calendaringConfig.maxSessionsPerLocation)
        continue;

      // Check if we're already at the max for this location

      // Just use the first session!
      for (const prospectiveSession of sortedProspectiveSessionsByCity[city]) {
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
          scheduledTrialSessionsByCity,
          sessionCountPerCity,
          sessionCountPerWeek,
          sessionScheduledPerCityPerWeek,
          weekOfString,
        });

        const index =
          sortedProspectiveSessionsByCity[city].indexOf(prospectiveSession);
        if (index !== -1) {
          sortedProspectiveSessionsByCity[city].splice(index, 1);
        }
      }
    }
  }

  return {
    scheduledTrialSessionsByCity,
    sessionCountPerWeek,
  };
};

function addScheduledTrialSession({
  city,
  scheduledTrialSessionsByCity,
  sessionCountPerCity,
  sessionCountPerWeek,
  sessionScheduledPerCityPerWeek,
  sessionType,
  weekOfString,
}: {
  city: string;
  scheduledTrialSessionsByCity: Record<string, ScheduledTrialSession[]>;
  sessionCountPerCity: Record<string, number>;
  sessionCountPerWeek: Record<string, number>;
  sessionScheduledPerCityPerWeek: Record<string, Set<string>>;
  sessionType: TrialSessionTypes;
  weekOfString: string;
}) {
  if (!sessionCountPerCity[city]) sessionCountPerCity[city] = 0;
  if (!scheduledTrialSessionsByCity[city])
    scheduledTrialSessionsByCity[city] = [];

  scheduledTrialSessionsByCity[city].push({
    city,
    sessionType,
    weekOf: weekOfString,
  });

  sessionCountPerWeek[weekOfString]++;
  sessionCountPerCity[city]++;
  sessionScheduledPerCityPerWeek[weekOfString].add(city); // Mark this city as scheduled for the current week
}
