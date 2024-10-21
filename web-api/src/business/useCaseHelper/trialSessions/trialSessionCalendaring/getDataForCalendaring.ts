import {
  PROCEDURE_TYPES_MAP,
  REGULAR_TRIAL_CITY_STRINGS,
  SESSION_TYPES,
  TRIAL_CITY_STRINGS,
  TrialSessionTypes,
} from '@shared/business/entities/EntityConstants';
import {
  WASHINGTON_DC_SOUTH_STRING,
  WASHINGTON_DC_STRING,
} from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';

export type EligibleCase = Pick<
  RawCase,
  'preferredTrialCity' | 'procedureType' | 'docketNumber'
>;

export type CasesByCity = Record<string, EligibleCase[]>;

export type CaseCountByCity = Record<string, number>;

export const getDataForCalendaring = ({
  cases,
}: {
  cases: EligibleCase[];
  citiesFromLastTwoTerms: string[];
}): {
  initialSmallCaseCountsByCity: CaseCountByCity;
  initialRegularCaseCountsByCity: CaseCountByCity;
  smallCasesByCity: CasesByCity;
  regularCasesByCity: CasesByCity;
} => {
  const regularCasesByCity = getCasesByCity(cases, PROCEDURE_TYPES_MAP.regular);
  const smallCasesByCity = getCasesByCity(cases, PROCEDURE_TYPES_MAP.small);

  const initialRegularCaseCountsByCity = TRIAL_CITY_STRINGS.reduce(
    (acc, city) => {
      if (city === WASHINGTON_DC_STRING) {
        // We only schedule non-special sessions at DC South, so we only need to
        // worry about case counts for South.
        acc[WASHINGTON_DC_SOUTH_STRING] = regularCasesByCity[city]?.length || 0;
      } else {
        acc[city] = regularCasesByCity[city]?.length || 0;
      }
      return acc;
    },
    {},
  );

  const initialSmallCaseCountsByCity = TRIAL_CITY_STRINGS.reduce(
    (acc, city) => {
      if (city === WASHINGTON_DC_STRING) {
        acc[WASHINGTON_DC_SOUTH_STRING] = smallCasesByCity[city]?.length || 0;
      } else {
        acc[city] = smallCasesByCity[city]?.length || 0;
      }
      return acc;
    },
    {},
  );

  return {
    initialRegularCaseCountsByCity,
    initialSmallCaseCountsByCity,
    regularCasesByCity,
    smallCasesByCity,
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
        // TODO 10275: consider adding all "error condition" cases to collection
        // also, consider adding cases to accumulated obj here (for counting) and filter when scheduling instead
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
