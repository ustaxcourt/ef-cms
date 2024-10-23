import {
  PROCEDURE_TYPES_MAP,
  REGULAR_TRIAL_CITY_STRINGS,
  TRIAL_CITY_STRINGS,
} from '@shared/business/entities/EntityConstants';
import { ProspectiveSession } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/createProspectiveTrialSessions';
import {
  WASHINGTON_DC_NORTH_STRING,
  WASHINGTON_DC_SOUTH_STRING,
  WASHINGTON_DC_STRING,
} from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';

export type EligibleCase = Pick<
  RawCase,
  'preferredTrialCity' | 'procedureType' | 'docketNumber'
>;

// (export type GodObject)
export type CaseCountsAndSessionsByCity = Record<
  string,
  {
    initialSmallCases: number;
    initialRegularCases: number;
    remainingSmallCases: number;
    remainingRegularCases: number;
    sessions: ProspectiveSession[];
  }
>;

export const getDataForCalendaring = ({
  cases,
}: {
  cases: EligibleCase[];
}): {
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity;
  incorrectSizeRegularCases: EligibleCase[];
} => {
  let {
    caseCountsAndSessionsByCity,
    incorrectSizeCases: incorrectSizeRegularCases,
  } = getCasesByCityAndIncorrectlySizedCases(cases);

  return {
    caseCountsAndSessionsByCity,
    incorrectSizeRegularCases,
  };
};

const getCasesByCityAndIncorrectlySizedCases = (
  cases: EligibleCase[],
): {
  incorrectSizeCases: EligibleCase[];
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity;
} => {
  const incorrectSizeCases: EligibleCase[] = [];
  const caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity =
    initializeCaseCountsAndSessionsByCity();

  cases.forEach(currentCase => {
    if (!isCorrectlySizedCity(currentCase)) {
      incorrectSizeCases.push(currentCase);
    }

    caseCountsAndSessionsByCity[currentCase.preferredTrialCity!][
      `initial${currentCase.procedureType}Cases`
    ]++;
    caseCountsAndSessionsByCity[currentCase.preferredTrialCity!][
      `remaining${currentCase.procedureType}Cases`
    ]++;
  });

  handleWashingtonDC(caseCountsAndSessionsByCity);

  return { caseCountsAndSessionsByCity, incorrectSizeCases };
};

const isCorrectlySizedCity = (aCase): boolean => {
  return (
    aCase.procedureType !== PROCEDURE_TYPES_MAP.regular ||
    REGULAR_TRIAL_CITY_STRINGS.includes(aCase.preferredTrialCity!)
  );
};

const initializeCaseCountsAndSessionsByCity =
  (): CaseCountsAndSessionsByCity => {
    return TRIAL_CITY_STRINGS.reduce((acc, city) => {
      acc[city] = {
        initialRegularCases: 0,
        initialSmallCases: 0,
        remainingRegularCases: 0,
        remainingSmallCases: 0,
        sessions: [],
      };
      return acc;
    }, {});
  };

const handleWashingtonDC = (
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity,
) => {
  // Since we only assign non-special sessions to DC South,
  // we can use DC counts of non-special sessions at South.
  caseCountsAndSessionsByCity[WASHINGTON_DC_NORTH_STRING] = {
    initialRegularCases: 0,
    initialSmallCases: 0,
    remainingRegularCases: 0,
    remainingSmallCases: 0,
    sessions: [],
  };
  caseCountsAndSessionsByCity[WASHINGTON_DC_SOUTH_STRING] =
    caseCountsAndSessionsByCity[WASHINGTON_DC_STRING];
  delete caseCountsAndSessionsByCity[WASHINGTON_DC_STRING];
};
