import {
  PROCEDURE_TYPES_MAP,
  REGULAR_TRIAL_CITY_STRINGS,
  SESSION_TYPES,
  TrialSessionTypes,
} from '@shared/business/entities/EntityConstants';

export type EligibleCase = Pick<
  RawCase,
  'preferredTrialCity' | 'procedureType' | 'docketNumber'
>;

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

export type CasesByCity = Record<string, EligibleCase[]>;

export const createProspectiveTrialSessions = ({
  calendaringConfig,
  cases,
  citiesFromLastTwoTerms,
}: {
  cases: EligibleCase[];
  calendaringConfig: CalendaringConfig;
  citiesFromLastTwoTerms: string[];
}): {
  prospectiveSessionsByCity: ProspectiveSessionsByCity;
  initialSmallCasesByCity: CasesByCity;
  initialRegularCasesByCity: CasesByCity;
  remainingSmallCasesByCity: CasesByCity;
  remainingRegularCasesByCity: CasesByCity;
} => {
  const prospectiveSessionsByCity: ProspectiveSessionsByCity = {};

  const regularCasesByCity = getCasesByCity(cases, PROCEDURE_TYPES_MAP.regular);
  const smallCasesByCity = getCasesByCity(cases, PROCEDURE_TYPES_MAP.small);

  const initialRegularCasesByCity = { ...regularCasesByCity };
  const initialSmallCasesByCity = { ...smallCasesByCity };

  Object.keys(regularCasesByCity).forEach(city => {
    prospectiveSessionsByCity[city] = [];
  });
  Object.keys(smallCasesByCity).forEach(city => {
    prospectiveSessionsByCity[city] = [];
  });

  // const remainingRegularCasesByCity = {};
  // const remainingSmallCasesByCity = {};

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

    // remainingRegularCasesByCity[city] = [...remainingRegularCases];
    // remainingSmallCasesByCity[city] = [...remainingSmallCases];

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
    initialRegularCasesByCity,
    initialSmallCasesByCity,
    prospectiveSessionsByCity,
    remainingRegularCasesByCity: regularCasesByCity,
    remainingSmallCasesByCity: smallCasesByCity,
  };
};

function getCasesByCity(
  cases: EligibleCase[],
  type: TrialSessionTypes,
): CasesByCity {
  return cases
    .filter(c => c.procedureType === type)
    .reduce((acc, currentCase) => {
      if (
        type === SESSION_TYPES.regular &&
        !REGULAR_TRIAL_CITY_STRINGS.includes(currentCase.preferredTrialCity!)
      ) {
        // throw new Error(
        //   `Case ${currentCase.docketNumber} cannot be scheduled in ${currentCase.preferredTrialCity} because the session type does not match the trial city`,
        // );
        return acc;
      } else {
        if (!acc[currentCase.preferredTrialCity!]) {
          acc[currentCase.preferredTrialCity!] = [];
        }
        acc[currentCase.preferredTrialCity!].push(currentCase);
        return acc;
      }
    }, {});
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
