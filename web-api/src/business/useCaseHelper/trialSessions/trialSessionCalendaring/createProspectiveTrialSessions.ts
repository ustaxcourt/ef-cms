import { CaseCountsByProcedureTypeByCity } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/getDataForCalendaring';
import {
  PROCEDURE_TYPES_MAP,
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
  caseCountsByProcedureTypeByCity,
  citiesFromLastTwoTerms,
}: {
  calendaringConfig: CalendaringConfig;
  citiesFromLastTwoTerms: string[];
  caseCountsByProcedureTypeByCity: CaseCountsByProcedureTypeByCity;
}): {
  prospectiveSessionsByCity: ProspectiveSessionsByCity;
} => {
  const prospectiveSessionsByCity: ProspectiveSessionsByCity = {};

  const cities = new Set(Object.keys(caseCountsByProcedureTypeByCity));

  cities.forEach(city => {
    prospectiveSessionsByCity[city] = [];
  });

  for (const city in prospectiveSessionsByCity) {
    const cityWasNotVisitedInLastTwoTerms =
      !citiesFromLastTwoTerms.includes(city);

    let remainingRegularCaseCount =
      caseCountsByProcedureTypeByCity[city][PROCEDURE_TYPES_MAP.regular];
    let remainingSmallCaseCount =
      caseCountsByProcedureTypeByCity[city][PROCEDURE_TYPES_MAP.small];

    // One of these arrays will continue to decrease in size until it is smaller than the other, at which point prioritization below will flip.
    // For now, we are okay with this
    // schedule regular or small
    if (remainingRegularCaseCount >= remainingSmallCaseCount) {
      ({ remainingRegularCaseCount } = scheduleRegularCases({
        calendaringConfig,
        city,
        cityWasNotVisitedInLastTwoTerms,
        prospectiveSessionsByCity,
        remainingRegularCaseCount,
      }));
      ({ remainingSmallCaseCount } = scheduleSmallCases({
        calendaringConfig,
        city,
        cityWasNotVisitedInLastTwoTerms,
        prospectiveSessionsByCity,
        remainingSmallCaseCount,
      }));
    } else {
      ({ remainingSmallCaseCount } = scheduleSmallCases({
        calendaringConfig,
        city,
        cityWasNotVisitedInLastTwoTerms,
        prospectiveSessionsByCity,
        remainingSmallCaseCount,
      }));
      ({ remainingRegularCaseCount } = scheduleRegularCases({
        calendaringConfig,
        city,
        cityWasNotVisitedInLastTwoTerms,
        prospectiveSessionsByCity,
        remainingRegularCaseCount,
      }));
    }

    // Handle Hybrid Sessions
    if (
      remainingRegularCaseCount + remainingSmallCaseCount >=
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
      remainingRegularCaseCount = 0;
      remainingSmallCaseCount = 0;

      addProspectiveTrialSession({
        city,
        cityWasNotVisitedInLastTwoTerms,
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
      prospectiveSessionsByCity[city].length === 0 &&
      (remainingRegularCaseCount > 0 || remainingSmallCaseCount > 0)
    ) {
      const containsRegularCase = remainingRegularCaseCount > 0;
      const containsSmallCase = remainingSmallCaseCount > 0;
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

      remainingRegularCaseCount = 0;
      remainingSmallCaseCount = 0;
    }

    // Limit sessions per location
    prospectiveSessionsByCity[city] = prospectiveSessionsByCity[city].slice(
      0,
      calendaringConfig.maxSessionsPerLocation,
    );
  }

  return {
    prospectiveSessionsByCity,
  };
};

function scheduleRegularCases({
  calendaringConfig,
  city,
  cityWasNotVisitedInLastTwoTerms,
  prospectiveSessionsByCity,
  remainingRegularCaseCount,
}: {
  calendaringConfig: CalendaringConfig;
  city: string;
  cityWasNotVisitedInLastTwoTerms: boolean;
  prospectiveSessionsByCity: ProspectiveSessionsByCity;
  remainingRegularCaseCount: number;
}): { remainingRegularCaseCount: number } {
  while (
    remainingRegularCaseCount >= calendaringConfig.regularCaseMinimumQuantity
  ) {
    addProspectiveTrialSession({
      city,
      cityWasNotVisitedInLastTwoTerms,
      prospectiveSessionsByCity,
      sessionType: SESSION_TYPES.regular,
    });
    remainingRegularCaseCount -= calendaringConfig.regularCaseMaxQuantity;
  }

  return { remainingRegularCaseCount };
}

function scheduleSmallCases({
  calendaringConfig,
  city,
  cityWasNotVisitedInLastTwoTerms,
  prospectiveSessionsByCity,
  remainingSmallCaseCount,
}: {
  calendaringConfig: CalendaringConfig;
  city: string;
  cityWasNotVisitedInLastTwoTerms: boolean;
  prospectiveSessionsByCity: ProspectiveSessionsByCity;
  remainingSmallCaseCount: number;
}): { remainingSmallCaseCount: number } {
  while (
    remainingSmallCaseCount >= calendaringConfig.smallCaseMinimumQuantity
  ) {
    addProspectiveTrialSession({
      city,
      cityWasNotVisitedInLastTwoTerms,
      prospectiveSessionsByCity,
      sessionType: SESSION_TYPES.small,
    });
    remainingSmallCaseCount -= calendaringConfig.smallCaseMaxQuantity;
  }

  return { remainingSmallCaseCount };
}

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
