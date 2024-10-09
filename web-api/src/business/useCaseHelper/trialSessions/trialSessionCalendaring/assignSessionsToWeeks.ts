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
import {
  WASHINGTON_DC_NORTH_STRING,
  WASHINGTON_DC_SOUTH_STRING,
  WASHINGTON_DC_STRING,
} from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';

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

  // TODO 10275: test this (and be sure it works)
  const sortedProspectiveSessionsByCity = Object.keys(prospectiveSessionsByCity)
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
      if (key === WASHINGTON_DC_STRING) {
        obj[WASHINGTON_DC_SOUTH_STRING] = [];

        for (const prospectiveSession of prospectiveSessionsByCity[key]) {
          obj[WASHINGTON_DC_SOUTH_STRING].push({
            ...prospectiveSession,
            city: WASHINGTON_DC_SOUTH_STRING,
          });
        }

        return obj;
      }
      obj[key] = prospectiveSessionsByCity[key];
      return obj;
    }, {});

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

    const specialSessionsForWeekByLocation = specialSessionsForWeek.reduce(
      (acc, session) => {
        if (session.trialLocation === WASHINGTON_DC_STRING) {
          // assign special to special-only slot (north)
          // if north is occupied, assign to south
          if (!acc[WASHINGTON_DC_NORTH_STRING]) {
            acc[WASHINGTON_DC_NORTH_STRING] = session;
          } else if (!acc[WASHINGTON_DC_SOUTH_STRING]) {
            acc[WASHINGTON_DC_SOUTH_STRING] = session;
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

    for (const city in sortedProspectiveSessionsByCity) {
      // This is a redundant check, as we expect the length of the array to have
      // already been trimmed to at most the max before entering this function.
      // since we ignore things beyond the max, force prospective array to at most the max
      if (sessionCountPerCity[city] >= calendaringConfig.maxSessionsPerLocation)
        continue;

      // Check if we're already at the max for this location

      // Just use the first session!?
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
