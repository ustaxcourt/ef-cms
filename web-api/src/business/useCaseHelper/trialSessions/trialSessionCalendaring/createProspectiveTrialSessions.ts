import { CaseCountsAndSessionsByCity } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/getDataForCalendaring';
import {
  SESSION_TYPES,
  TrialSessionTypes,
} from '@shared/business/entities/EntityConstants';

export type ProspectiveSessionsByCity = Record<string, ProspectiveSession[]>;

export type ProspectiveSession = {
  city: string;
  sessionType: TrialSessionTypes;
  cityWasNotVisitedInLastTwoTerms: boolean;
  // potentially add
  // caseCount: number;
};

export type CalendaringConfig = {
  maxSessionsPerWeek: number;
  maxSessionsPerLocation: number;
  regularCaseMinimumQuantity: number;
  regularCaseMaxQuantity: number;
  smallCaseMinimumQuantity: number;
  smallCaseMaxQuantity: number;
  hybridCaseMaxQuantity: number;
  hybridCaseMinimumQuantity: number;
};

export const createProspectiveTrialSessions = ({
  calendaringConfig,
  caseCountsAndSessionsByCity,
  citiesFromLastTwoTerms,
}: {
  calendaringConfig: CalendaringConfig;
  citiesFromLastTwoTerms: string[];
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity;
}): {
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity;
} => {
  for (const city in caseCountsAndSessionsByCity) {
    const cityWasNotVisitedInLastTwoTerms =
      !citiesFromLastTwoTerms.includes(city);

    if (
      caseCountsAndSessionsByCity[city].remainingRegularCases >=
      caseCountsAndSessionsByCity[city].remainingSmallCases
    ) {
      scheduleRegularCases({
        calendaringConfig,
        caseCountsAndSessionsByCity,
        city,
        cityWasNotVisitedInLastTwoTerms,
      });
      scheduleSmallCases({
        calendaringConfig,
        caseCountsAndSessionsByCity,
        city,
        cityWasNotVisitedInLastTwoTerms,
      });
    } else {
      scheduleSmallCases({
        calendaringConfig,
        caseCountsAndSessionsByCity,
        city,
        cityWasNotVisitedInLastTwoTerms,
      });
      scheduleRegularCases({
        calendaringConfig,
        caseCountsAndSessionsByCity,
        city,
        cityWasNotVisitedInLastTwoTerms,
      });
    }

    // Handle Hybrid Sessions
    if (
      caseCountsAndSessionsByCity[city].remainingRegularCases +
        caseCountsAndSessionsByCity[city].remainingSmallCases >=
      calendaringConfig.hybridCaseMinimumQuantity
    ) {
      addProspectiveTrialSession({
        caseCountsAndSessionsByCity,
        city,
        cityWasNotVisitedInLastTwoTerms,
        sessionType: SESSION_TYPES.hybrid,
      });
      // Since the min of reg cases is 40, and the min of small cases is 40,
      // and the sum of these two values is below the hybrid case max of 100,
      // we can safely assume that if the combination of remaining regular
      // cases and remaining small cases is above the minimum of 50, we can
      // assign all of those remaining cases to a hybrid session.
      //
      // This comment applies to the if statement's condition, as well as to
      // the setting of regularCasesByCity[city] and smallCasesByCity[city] to
      // empty arrays below.
      caseCountsAndSessionsByCity[city].remainingRegularCases = 0;
      caseCountsAndSessionsByCity[city].remainingSmallCases = 0;
    }

    // Are there any cities that have not been visited in the last two terms
    // that have not yet had any sessions scheduled? For any locations that
    // meet this criterion, assemble all cases associated with that location in
    // a session, disregarding the minimum quantity rule. The type of each
    // session will depend on the sort of cases for that city: i.e., could be a
    // regular, small, or hybrid session depending on the cases.

    // if current city is low volume city and has not yet been scheduled, we know it did not meet any minimums above.
    // So, add one session, determining the type based on the procedure type of the associated cases.
    if (
      cityWasNotVisitedInLastTwoTerms &&
      caseCountsAndSessionsByCity[city].sessions.length === 0 &&
      (caseCountsAndSessionsByCity[city].remainingRegularCases > 0 ||
        caseCountsAndSessionsByCity[city].remainingSmallCases > 0)
    ) {
      const containsRegularCase =
        caseCountsAndSessionsByCity[city].remainingRegularCases > 0;
      const containsSmallCase =
        caseCountsAndSessionsByCity[city].remainingSmallCases > 0;
      const lowVolumeSessionType =
        containsRegularCase && containsSmallCase
          ? SESSION_TYPES.hybrid
          : containsRegularCase
            ? SESSION_TYPES.regular
            : SESSION_TYPES.small;

      addProspectiveTrialSession({
        caseCountsAndSessionsByCity,
        city,
        cityWasNotVisitedInLastTwoTerms,
        sessionType: lowVolumeSessionType,
      });

      caseCountsAndSessionsByCity[city].remainingRegularCases = 0;
      caseCountsAndSessionsByCity[city].remainingSmallCases = 0;
    }

    // Limit sessions per location
    // TODO 10275: is this still necessary? we shouldn't be scheduling more than one session, since we've failed to meet the small, regular, AND hybrid mins
    caseCountsAndSessionsByCity[city].sessions = caseCountsAndSessionsByCity[
      city
    ].sessions.slice(0, calendaringConfig.maxSessionsPerLocation);
  }

  resetRemainingCaseCounters(caseCountsAndSessionsByCity);

  return {
    caseCountsAndSessionsByCity,
  };
};

const resetRemainingCaseCounters = (
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity,
) => {
  for (const city in caseCountsAndSessionsByCity) {
    caseCountsAndSessionsByCity[city].remainingRegularCases =
      caseCountsAndSessionsByCity[city].initialRegularCases;

    caseCountsAndSessionsByCity[city].remainingSmallCases =
      caseCountsAndSessionsByCity[city].initialSmallCases;
  }
};

function scheduleRegularCases({
  calendaringConfig,
  caseCountsAndSessionsByCity,
  city,
  cityWasNotVisitedInLastTwoTerms,
}: {
  calendaringConfig: CalendaringConfig;
  city: string;
  cityWasNotVisitedInLastTwoTerms: boolean;
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity;
}): void {
  while (
    caseCountsAndSessionsByCity[city].remainingRegularCases >=
    calendaringConfig.regularCaseMinimumQuantity
  ) {
    addProspectiveTrialSession({
      caseCountsAndSessionsByCity,
      city,
      cityWasNotVisitedInLastTwoTerms,
      sessionType: SESSION_TYPES.regular,
    });

    if (
      caseCountsAndSessionsByCity[city].remainingRegularCases -
        calendaringConfig.regularCaseMaxQuantity >
      0
    ) {
      caseCountsAndSessionsByCity[city].remainingRegularCases -=
        calendaringConfig.regularCaseMaxQuantity;
    } else {
      caseCountsAndSessionsByCity[city].remainingRegularCases = 0;
    }
  }
}

function scheduleSmallCases({
  calendaringConfig,
  caseCountsAndSessionsByCity,
  city,
  cityWasNotVisitedInLastTwoTerms,
}: {
  calendaringConfig: CalendaringConfig;
  city: string;
  cityWasNotVisitedInLastTwoTerms: boolean;
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity;
}): void {
  while (
    caseCountsAndSessionsByCity[city].remainingSmallCases >=
    calendaringConfig.smallCaseMinimumQuantity
  ) {
    addProspectiveTrialSession({
      caseCountsAndSessionsByCity,
      city,
      cityWasNotVisitedInLastTwoTerms,
      sessionType: SESSION_TYPES.small,
    });
    if (
      caseCountsAndSessionsByCity[city].remainingSmallCases -
        calendaringConfig.smallCaseMaxQuantity >
      0
    ) {
      caseCountsAndSessionsByCity[city].remainingSmallCases -=
        calendaringConfig.regularCaseMaxQuantity;
    } else {
      caseCountsAndSessionsByCity[city].remainingSmallCases = 0;
    }
  }
}

function addProspectiveTrialSession({
  caseCountsAndSessionsByCity,
  city,
  cityWasNotVisitedInLastTwoTerms,
  sessionType,
}: {
  city: string;
  cityWasNotVisitedInLastTwoTerms: boolean;
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity;
  sessionType: TrialSessionTypes;
}): void {
  caseCountsAndSessionsByCity[city].sessions.push({
    city,
    cityWasNotVisitedInLastTwoTerms,
    sessionType,
  });
}
