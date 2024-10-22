import {
  CalendaringConfig,
  ProspectiveSessionsByCity,
} from './createProspectiveTrialSessions';
import { Constraint } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/constraints';
import {
  FORMATS,
  createDateAtStartOfWeekEST,
} from '@shared/business/utilities/DateHandler';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import {
  RemainingCaseCountByCity,
  SessionCountByWeek,
  TrialSessionsByCity,
} from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/assignSessionsToWeeks';
import {
  SESSION_TYPES,
  TRIAL_CITY_STRINGS,
  TrialSessionTypes,
} from '@shared/business/entities/EntityConstants';
import {
  WASHINGTON_DC_NORTH_STRING,
  WASHINGTON_DC_SOUTH_STRING,
  WASHINGTON_DC_STRING,
} from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';
import { cloneDeep } from 'lodash';

export type CalendarState = {
  sessionCountPerWeek: Record<string, number>;
  sessionScheduledPerCityPerWeek: Record<string, Set<string>>;
  reservedWeekOfLocationIntersection: Record<string, string[]>;
  scheduledTrialSessionsByCity: TrialSessionsByCity;
  sessionCountPerCity: Record<string, number>;
};

export class CalendarGenerator {
  private calendarState: CalendarState;
  private remainingRegularCaseCountByCity: RemainingCaseCountByCity;
  private remainingSmallCaseCountByCity: RemainingCaseCountByCity;

  constructor(
    private calendaringConfig: CalendaringConfig,
    private constraints: Constraint[],
    private prospectiveSessionsByCity: ProspectiveSessionsByCity,
    private weeksToLoop: string[],
    private specialSessions: RawTrialSession[],
    smallCaseCountByCity: Record<string, number>,
    regularCaseCountByCity: Record<string, number>,
  ) {
    this.remainingRegularCaseCountByCity = cloneDeep(regularCaseCountByCity);
    this.remainingSmallCaseCountByCity = cloneDeep(smallCaseCountByCity);
    this.calendarState = {
      reservedWeekOfLocationIntersection: {},
      scheduledTrialSessionsByCity: {},
      sessionCountPerCity: {},
      sessionCountPerWeek: {},
      sessionScheduledPerCityPerWeek: {},
    };

    // Initialize session counts
    this.weeksToLoop.forEach(week => {
      this.calendarState.sessionCountPerWeek[week] = 0;
      this.calendarState.sessionScheduledPerCityPerWeek[week] = new Set();
    });

    this.calendarState.scheduledTrialSessionsByCity = {};

    TRIAL_CITY_STRINGS.forEach(cityStringKey => {
      if (cityStringKey === WASHINGTON_DC_STRING) {
        this.calendarState.sessionCountPerCity[WASHINGTON_DC_NORTH_STRING] = 0;
        this.calendarState.scheduledTrialSessionsByCity[
          WASHINGTON_DC_NORTH_STRING
        ] = [];
        this.calendarState.sessionCountPerCity[WASHINGTON_DC_SOUTH_STRING] = 0;
        this.calendarState.scheduledTrialSessionsByCity[
          WASHINGTON_DC_SOUTH_STRING
        ] = [];
      } else {
        this.calendarState.sessionCountPerCity[cityStringKey] = 0;
        this.calendarState.scheduledTrialSessionsByCity[cityStringKey] = [];
      }
    });
  }

  public generateCalendar = (): {
    sessionCountPerWeek: SessionCountByWeek;
    scheduledTrialSessionsByCity: TrialSessionsByCity;
    remainingRegularCaseCountByCity: RemainingCaseCountByCity;
    remainingSmallCaseCountByCity: RemainingCaseCountByCity;
  } => {
    // check special sessions
    const specialSessionsByLocation = this.specialSessions.reduce(
      (acc, session) => {
        if (!acc[session.trialLocation!]) {
          acc[session.trialLocation!] = [];
        }
        acc[session.trialLocation!].push(session);
        return acc;
      },
      {},
    );

    for (const location in specialSessionsByLocation) {
      if (
        specialSessionsByLocation[location].length >
        this.calendaringConfig.maxSessionsPerLocation
      ) {
        throw new Error(
          `Special session count exceeds the max sessions per location for ${location}`,
        );
      }
    }

    // TODO 10275: test this (and be sure it works)
    const sortedProspectiveSessionsByCity: TrialSessionsByCity = Object.keys(
      this.prospectiveSessionsByCity,
    )
      .sort((a, b) => {
        const aNotVisited =
          this.prospectiveSessionsByCity[a][0]
            ?.cityWasNotVisitedInLastTwoTerms || false;
        const bNotVisited =
          this.prospectiveSessionsByCity[b][0]
            ?.cityWasNotVisitedInLastTwoTerms || false;

        return aNotVisited === bNotVisited ? 0 : aNotVisited ? -1 : 1;
      })
      .reduce((obj, key) => {
        if (key === WASHINGTON_DC_STRING) {
          obj[WASHINGTON_DC_SOUTH_STRING] = [];

          for (const prospectiveSession of this.prospectiveSessionsByCity[
            key
          ]) {
            obj[WASHINGTON_DC_SOUTH_STRING].push({
              ...prospectiveSession,
              city: WASHINGTON_DC_SOUTH_STRING,
            });
          }

          return obj;
        }
        obj[key] = this.prospectiveSessionsByCity[key];
        return obj;
      }, {});

    // special sessions handled ahead of all reg, small

    this.specialSessions.forEach(session => {
      const sessionWeekOf = createDateAtStartOfWeekEST(
        session.startDate,
        FORMATS.YYYYMMDD,
      );
      let trialLocation = session.trialLocation!;

      if (
        this.calendarState.sessionCountPerWeek[sessionWeekOf] >=
        this.calendaringConfig.maxSessionsPerWeek
      ) {
        throw new Error(
          `Specials sessions for week of ${sessionWeekOf} exceed maximum sessions allowed per week`,
        );
      }

      if (
        this.calendarState.sessionScheduledPerCityPerWeek[sessionWeekOf].has(
          trialLocation,
        )
      ) {
        throw new Error(
          'There must only be one special trial session per location per week.',
        );
      }

      if (session.trialLocation === WASHINGTON_DC_STRING) {
        if (
          this.calendarState.sessionCountPerCity[WASHINGTON_DC_NORTH_STRING] >=
            this.calendaringConfig.maxSessionsPerLocation ||
          this.calendarState.sessionScheduledPerCityPerWeek[sessionWeekOf].has(
            WASHINGTON_DC_NORTH_STRING,
          )
        ) {
          if (
            this.calendarState.sessionCountPerCity[
              WASHINGTON_DC_SOUTH_STRING
            ] >= this.calendaringConfig.maxSessionsPerLocation
          ) {
            throw new Error(
              `Special sessions in ${WASHINGTON_DC_STRING} exceed the maximum allowed`,
            );
          } else if (
            this.calendarState.sessionScheduledPerCityPerWeek[
              sessionWeekOf
            ].has(WASHINGTON_DC_SOUTH_STRING)
          ) {
            throw new Error(
              'There must be no more than two special trial sessions per week in Washington, DC.',
            );
          } else {
            trialLocation = WASHINGTON_DC_SOUTH_STRING;
          }
        } else {
          trialLocation = WASHINGTON_DC_NORTH_STRING;
        }
      }

      this.addScheduledTrialSession({
        city: trialLocation,
        sessionType: SESSION_TYPES.special,
        weekOf: sessionWeekOf,
      });

      // given the sessionWeekOf, find the next week somehow and add it as a key
      // to reservedWeekOfLocationIntersection, then push the trialLocation value
      // to the array keyed to the city
      const nextWeekOfString =
        this.weeksToLoop[this.weeksToLoop.indexOf(sessionWeekOf) + 1];
      if (
        !this.calendarState.reservedWeekOfLocationIntersection[nextWeekOfString]
      )
        this.calendarState.reservedWeekOfLocationIntersection[
          nextWeekOfString
        ] = [];
      this.calendarState.reservedWeekOfLocationIntersection[
        nextWeekOfString
      ].push(trialLocation);
    });

    for (const currentWeek of this.weeksToLoop) {
      const weekOfString = currentWeek;
      for (const city in sortedProspectiveSessionsByCity) {
        for (const prospectiveSession of sortedProspectiveSessionsByCity[
          city
        ]) {
          const proposedSession = {
            city: prospectiveSession.city,
            sessionType: prospectiveSession.sessionType,
            weekOf: weekOfString,
          };
          // ensure every constraint passes, then schedule
          const canScheduleSession = this.constraints.every(constraint =>
            constraint({
              calendarState: this.calendarState,
              calendaringConfig: this.calendaringConfig,
              proposedSession,
            }),
          );

          if (canScheduleSession) {
            this.addScheduledTrialSession({
              ...proposedSession,
            });

            const index =
              sortedProspectiveSessionsByCity[city].indexOf(prospectiveSession);

            if (index !== -1) {
              sortedProspectiveSessionsByCity[city].splice(index, 1);
            }
          }
        }
      }
    }

    return {
      remainingRegularCaseCountByCity: this.remainingRegularCaseCountByCity,
      remainingSmallCaseCountByCity: this.remainingSmallCaseCountByCity,
      scheduledTrialSessionsByCity:
        this.calendarState.scheduledTrialSessionsByCity,
      sessionCountPerWeek: this.calendarState.sessionCountPerWeek,
    };
  };

  private addScheduledTrialSession = ({
    city,
    sessionType,
    weekOf,
  }: {
    city: string;
    sessionType: TrialSessionTypes;
    weekOf: string;
  }) => {
    this.calendarState.scheduledTrialSessionsByCity[city].push({
      city,
      sessionType,
      weekOf,
    });

    // eslint-disable-next-line spellcheck/spell-checker
    // Decrement by the max count for that session type. If that's less than 0, then we scheduled
    // a session that was more than the min and less than the max, so just set it to 0
    if (sessionType === SESSION_TYPES.regular) {
      this.remainingRegularCaseCountByCity[city] -=
        this.calendaringConfig.regularCaseMaxQuantity;
      if (this.remainingRegularCaseCountByCity[city] < 0)
        this.remainingRegularCaseCountByCity[city] = 0;
    } else if (sessionType === SESSION_TYPES.small) {
      this.remainingSmallCaseCountByCity[city] -=
        this.calendaringConfig.smallCaseMaxQuantity;
      if (this.remainingSmallCaseCountByCity[city] < 0)
        this.remainingSmallCaseCountByCity[city] = 0;
    } else if (sessionType === SESSION_TYPES.hybrid) {
      this.remainingRegularCaseCountByCity[city] = 0;
      this.remainingSmallCaseCountByCity[city] = 0;
    }

    this.calendarState.sessionCountPerWeek[weekOf]++;
    this.calendarState.sessionCountPerCity[city]++;
    this.calendarState.sessionScheduledPerCityPerWeek[weekOf].add(city); // Mark this city as scheduled for the current week
  };
}
