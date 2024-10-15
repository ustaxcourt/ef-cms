import { CasesByCity } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/getDataForCalendaring';
import {
  SESSION_TYPES,
  TrialSessionTypes,
} from '@shared/business/entities/EntityConstants';

export type ProspectiveSessionsByCity = Record<
  string,
  {
    city: string;
    sessionType: TrialSessionTypes;
    cityWasNotVisitedInLastTwoTerms: boolean;
  }[]
>;

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
  citiesFromLastTwoTerms,
  regularCasesByCity,
  smallCasesByCity,
}: {
  calendaringConfig: CalendaringConfig;
  citiesFromLastTwoTerms: string[];
  regularCasesByCity: CasesByCity;
  smallCasesByCity: CasesByCity;
}): {
  prospectiveSessionsByCity: ProspectiveSessionsByCity;
} => {
  const prospectiveSessionsByCity: ProspectiveSessionsByCity = {};

  Object.keys(regularCasesByCity).forEach(city => {
    prospectiveSessionsByCity[city] = [];
  });
  Object.keys(smallCasesByCity).forEach(city => {
    prospectiveSessionsByCity[city] = [];
  });

  for (const city in prospectiveSessionsByCity) {
    let regularCaseSliceSize;
    let smallCaseSliceSize;

    const cityWasNotVisitedInLastTwoTerms =
      !citiesFromLastTwoTerms.includes(city);

    // One of these arrays will continue to decrease in size until it is smaller than the other, at which point prioritization below will flip.
    // For now, we are okay with this
    // schedule regular or small
    if (regularCasesByCity[city]?.length >= smallCasesByCity[city]?.length) {
      scheduleRegularCases({
        calendaringConfig,
        city,
        cityWasNotVisitedInLastTwoTerms,
        prospectiveSessionsByCity,
        regularCaseSliceSize,
        regularCasesByCity,
      });
      scheduleSmallCases({
        calendaringConfig,
        city,
        cityWasNotVisitedInLastTwoTerms,
        prospectiveSessionsByCity,
        smallCaseSliceSize,
        smallCasesByCity,
      });
    } else {
      scheduleSmallCases({
        calendaringConfig,
        city,
        cityWasNotVisitedInLastTwoTerms,
        prospectiveSessionsByCity,
        smallCaseSliceSize,
        smallCasesByCity,
      });
      scheduleRegularCases({
        calendaringConfig,
        city,
        cityWasNotVisitedInLastTwoTerms,
        prospectiveSessionsByCity,
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
        cityWasNotVisitedInLastTwoTerms: false,
        prospectiveSessionsByCity,
        sessionType: SESSION_TYPES.hybrid,
      });
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
      prospectiveSessionsByCity[city].length === 0
    ) {
      const containsRegularCase = regularCasesByCity[city]?.length > 0;
      const containsSmallCase = smallCasesByCity[city]?.length > 0;
      const lowVolumeSessionType =
        containsRegularCase && containsSmallCase
          ? SESSION_TYPES.hybrid
          : containsRegularCase
            ? SESSION_TYPES.regular
            : SESSION_TYPES.small;

      addProspectiveTrialSession({
        city,
        cityWasNotVisitedInLastTwoTerms,
        prospectiveSessionsByCity,
        sessionType: lowVolumeSessionType,
      });

      regularCasesByCity[city] = [];
      smallCasesByCity[city] = [];
    }
  }

  Object.keys(prospectiveSessionsByCity).forEach(city => {
    prospectiveSessionsByCity[city] = prospectiveSessionsByCity[city].splice(
      0,
      calendaringConfig.maxSessionsPerLocation,
    );
  });

  return {
    prospectiveSessionsByCity,
  };
};

function addProspectiveTrialSession({
  city,
  cityWasNotVisitedInLastTwoTerms,
  prospectiveSessionsByCity,
  sessionType,
}: {
  city: string;
  cityWasNotVisitedInLastTwoTerms: boolean;
  prospectiveSessionsByCity: ProspectiveSessionsByCity;
  sessionType: TrialSessionTypes;
}): void {
  prospectiveSessionsByCity[city].push({
    city,
    cityWasNotVisitedInLastTwoTerms,
    sessionType,
  });
}

function scheduleRegularCases({
  calendaringConfig,
  city,
  cityWasNotVisitedInLastTwoTerms = false,
  prospectiveSessionsByCity,
  regularCasesByCity,
  regularCaseSliceSize,
}: {
  calendaringConfig: CalendaringConfig;
  city: string;
  cityWasNotVisitedInLastTwoTerms: boolean;
  prospectiveSessionsByCity: ProspectiveSessionsByCity;
  regularCasesByCity: CasesByCity;
  regularCaseSliceSize: number;
}): void {
  while (
    (regularCasesByCity[city]?.length || 0) >=
    calendaringConfig.regularCaseMinimumQuantity
  ) {
    regularCaseSliceSize = calendaringConfig.regularCaseMaxQuantity;

    regularCasesByCity[city].splice(0, regularCaseSliceSize);

    addProspectiveTrialSession({
      city,
      cityWasNotVisitedInLastTwoTerms,
      prospectiveSessionsByCity,
      sessionType: SESSION_TYPES.regular,
    });
  }
}

function scheduleSmallCases({
  calendaringConfig,
  city,
  cityWasNotVisitedInLastTwoTerms = false,
  prospectiveSessionsByCity,
  smallCasesByCity,
  smallCaseSliceSize,
}: {
  calendaringConfig: CalendaringConfig;
  city: string;
  cityWasNotVisitedInLastTwoTerms: boolean;
  prospectiveSessionsByCity: ProspectiveSessionsByCity;
  smallCasesByCity: CasesByCity;
  smallCaseSliceSize: number;
}): void {
  while (
    (smallCasesByCity[city]?.length || 0) >=
    calendaringConfig.smallCaseMinimumQuantity
  ) {
    smallCaseSliceSize = calendaringConfig.smallCaseMaxQuantity;

    smallCasesByCity[city].splice(0, smallCaseSliceSize);

    addProspectiveTrialSession({
      city,
      cityWasNotVisitedInLastTwoTerms,
      prospectiveSessionsByCity,
      sessionType: SESSION_TYPES.small,
    });
  }
}
