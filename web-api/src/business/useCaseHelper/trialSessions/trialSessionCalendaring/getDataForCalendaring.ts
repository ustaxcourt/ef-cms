import {
  PROCEDURE_TYPES_MAP,
  REGULAR_TRIAL_CITY_STRINGS,
  TRIAL_CITY_STRINGS,
} from '@shared/business/entities/EntityConstants';
import {
  WASHINGTON_DC_NORTH_STRING,
  WASHINGTON_DC_SOUTH_STRING,
  WASHINGTON_DC_STRING,
} from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';

export type EligibleCase = Pick<
  RawCase,
  'preferredTrialCity' | 'procedureType' | 'docketNumber'
>;

export type CaseCountsByProcedureTypeByCity = Record<
  string,
  { [PROCEDURE_TYPES_MAP.regular]: number; [PROCEDURE_TYPES_MAP.small]: number }
>;

export const getDataForCalendaring = ({
  cases,
}: {
  cases: EligibleCase[];
}): {
  caseCountsByProcedureTypeByCity: CaseCountsByProcedureTypeByCity;
  incorrectSizeRegularCases: EligibleCase[];
} => {
  let {
    caseCountsByProcedureTypeByCity,
    incorrectSizeCases: incorrectSizeRegularCases,
  } = getCasesByCityAndIncorrectlySizedCases(cases);

  return {
    caseCountsByProcedureTypeByCity,
    incorrectSizeRegularCases,
  };
};

const getCasesByCityAndIncorrectlySizedCases = (
  cases: EligibleCase[],
): {
  incorrectSizeCases: EligibleCase[];
  caseCountsByProcedureTypeByCity: CaseCountsByProcedureTypeByCity;
} => {
  const incorrectSizeCases: EligibleCase[] = [];
  const caseCountsByProcedureTypeByCity: CaseCountsByProcedureTypeByCity =
    initializeCaseCountsByProcedureTypeByCity();

  cases.forEach(currentCase => {
    if (!isCorrectlySizedCity(currentCase)) {
      incorrectSizeCases.push(currentCase);
    }

    caseCountsByProcedureTypeByCity[currentCase.preferredTrialCity!][
      currentCase.procedureType
    ]++;
  });

  handleWashingtonDC(caseCountsByProcedureTypeByCity);

  return { caseCountsByProcedureTypeByCity, incorrectSizeCases };
};

const isCorrectlySizedCity = (aCase): boolean => {
  return (
    aCase.procedureType !== PROCEDURE_TYPES_MAP.regular ||
    REGULAR_TRIAL_CITY_STRINGS.includes(aCase.preferredTrialCity!)
  );
};

const initializeCaseCountsByProcedureTypeByCity =
  (): CaseCountsByProcedureTypeByCity => {
    return TRIAL_CITY_STRINGS.reduce((acc, city) => {
      acc[city] = {
        [PROCEDURE_TYPES_MAP.regular]: 0,
        [PROCEDURE_TYPES_MAP.small]: 0,
      };
      return acc;
    }, {});
  };

const handleWashingtonDC = (
  caseCountsByProcedureTypeByCity: CaseCountsByProcedureTypeByCity,
) => {
  // Since we only assign non-special sessions to DC South,
  // we can use DC counts of non-special sessions at South.
  caseCountsByProcedureTypeByCity[WASHINGTON_DC_NORTH_STRING] = {
    [PROCEDURE_TYPES_MAP.regular]: 0,
    [PROCEDURE_TYPES_MAP.small]: 0,
  };
  caseCountsByProcedureTypeByCity[WASHINGTON_DC_SOUTH_STRING] =
    caseCountsByProcedureTypeByCity[WASHINGTON_DC_STRING];
  delete caseCountsByProcedureTypeByCity[WASHINGTON_DC_STRING];
};
