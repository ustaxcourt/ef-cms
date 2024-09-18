import {
  PROCEDURE_TYPES_MAP,
  REGULAR_TRIAL_CITY_STRINGS,
  SESSION_TYPES,
  TrialSessionTypes,
} from '@shared/business/entities/EntityConstants';

export type EligibleCase = Pick<
  RawCase,
  'preferredTrialCity' | 'procedureType'
>;

export const createProspectiveTrialSessions = ({
  calendaringConfig,
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
}): Record<
  string,
  {
    city: string;
    sessionType: TrialSessionTypes;
  }[]
> => {
  const potentialTrialLocations: Record<
    string,
    {
      city: string;
      sessionType: TrialSessionTypes;
    }[]
  > = {};

  const regularCasesByCity = getCasesByCity(cases, PROCEDURE_TYPES_MAP.regular);
  const smallCasesByCity = getCasesByCity(cases, PROCEDURE_TYPES_MAP.small);

  Object.keys(regularCasesByCity).forEach(city => {
    potentialTrialLocations[city] = [];
  });
  Object.keys(smallCasesByCity).forEach(city => {
    potentialTrialLocations[city] = [];
  });

  for (const city in potentialTrialLocations) {
    let regularCaseSliceSize;
    let smallCaseSliceSize;
    // One of these arrays will continue to decrease in size until it is smaller than the other, at which point prioritization below will flip.
    // For now, we are okay with this -- TODO 10275 confirm
    // schedule regular or small
    if (regularCasesByCity[city]?.length >= smallCasesByCity[city]?.length) {
      scheduleRegularCases({
        calendaringConfig,
        city,
        potentialTrialLocations,
        regularCaseSliceSize,
        regularCasesByCity,
      });
      scheduleSmallCases({
        calendaringConfig,
        city,
        potentialTrialLocations,
        smallCaseSliceSize,
        smallCasesByCity,
      });
    } else {
      scheduleSmallCases({
        calendaringConfig,
        city,
        potentialTrialLocations,
        smallCaseSliceSize,
        smallCasesByCity,
      });
      scheduleRegularCases({
        calendaringConfig,
        city,
        potentialTrialLocations,
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
        potentialTrialLocations,
        sessionType: SESSION_TYPES.hybrid,
      });
    }
  }

  // TODO don't forget we need to deal with overrides.
  Object.keys(potentialTrialLocations).forEach(city => {
    potentialTrialLocations[city] = potentialTrialLocations[city].splice(
      0,
      calendaringConfig.maxSessionsPerLocation,
    );
  });

  return potentialTrialLocations;
};

function getCasesByCity(cases, type) {
  return cases
    .filter(c => c.procedureType === type)
    .reduce((acc, currentCase) => {
      if (
        type === SESSION_TYPES.regular &&
        !REGULAR_TRIAL_CITY_STRINGS.includes(currentCase.preferredTrialCity)
      ) {
        throw new Error(
          `Case ${currentCase.docketNumber} cannot be scheduled in ${currentCase.preferredTrialCity} because the session type does not match the trial city`,
        );
      }
      if (!acc[currentCase.preferredTrialCity!]) {
        acc[currentCase.preferredTrialCity!] = [];
      }
      acc[currentCase.preferredTrialCity!].push(currentCase);
      return acc;
    }, {});
}

function addProspectiveTrialSession({
  city,
  potentialTrialLocations,
  sessionType,
}) {
  potentialTrialLocations[city].push({
    city,
    sessionType,
  });
}

function scheduleRegularCases({
  calendaringConfig,
  city,
  potentialTrialLocations,
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
      potentialTrialLocations,
      sessionType: SESSION_TYPES.regular,
    });
  }
}

function scheduleSmallCases({
  calendaringConfig,
  city,
  potentialTrialLocations,
  smallCasesByCity,
  smallCaseSliceSize,
}) {
  while (
    (smallCasesByCity[city]?.length || 0) >=
    calendaringConfig.smallCaseMinimumQuantity
  ) {
    smallCaseSliceSize = calendaringConfig.smallCaseMaxQuantity;

    smallCasesByCity[city].splice(0, smallCaseSliceSize);

    addProspectiveTrialSession({
      city,
      potentialTrialLocations,
      sessionType: SESSION_TYPES.small,
    });
  }
}
