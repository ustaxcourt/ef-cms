import {
  PROCEDURE_TYPES_MAP,
  REGULAR_TRIAL_CITY_STRINGS,
  TRIAL_CITY_STRINGS,
} from '@shared/business/entities/EntityConstants';
import {
  ProspectiveTrialSession,
  ScheduledTrialSession,
} from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/createProspectiveTrialSessions';
import {
  WASHINGTON_DC_NORTH_STRING,
  WASHINGTON_DC_SOUTH_STRING,
  WASHINGTON_DC_STRING,
} from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';

export type EligibleCase = Pick<
  RawCase,
  'preferredTrialCity' | 'procedureType' | 'docketNumber'
>;

export type CaseCountsAndSessionsByCity = Record<
  string,
  {
    initialSmallCases: number;
    initialRegularCases: number;
    remainingSmallCases: number;
    remainingRegularCases: number;
    prospectiveSessions: ProspectiveTrialSession[];
    scheduledSessions: ScheduledTrialSession[];
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

  return {
    caseCountsAndSessionsByCity,
    incorrectSizeRegularCases: incorrectSizeCases,
  };
};

const isCorrectlySizedCity = (aCase: EligibleCase): boolean => {
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
        prospectiveSessions: [],
        remainingRegularCases: 0,
        remainingSmallCases: 0,
        scheduledSessions: [],
      };
      return acc;
    }, {});
  };

const handleWashingtonDC = (
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity,
): void => {
  // Since we only assign non-special sessions to DC South,
  // we can use DC counts of non-special sessions at South.
  caseCountsAndSessionsByCity[WASHINGTON_DC_NORTH_STRING] = {
    initialRegularCases: 0,
    initialSmallCases: 0,
    prospectiveSessions: [],
    remainingRegularCases: 0,
    remainingSmallCases: 0,
    scheduledSessions: [],
  };
  caseCountsAndSessionsByCity[WASHINGTON_DC_SOUTH_STRING] =
    caseCountsAndSessionsByCity[WASHINGTON_DC_STRING];
  delete caseCountsAndSessionsByCity[WASHINGTON_DC_STRING];
};
