import { CaseCountsAndSessionsByCity } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/getDataForCalendaring';
import {
  SESSION_TYPES,
  TrialSessionTypes,
} from '@shared/business/entities/EntityConstants';

export type ProspectiveSessionsByCity = Record<
  string,
  ProspectiveTrialSession[]
>;

export type ProspectiveTrialSession = {
  trialLocation: string;
  sessionType: TrialSessionTypes;
  cityWasNotVisitedInLastTwoTerms: boolean;
};

export type ScheduledTrialSession = {
  trialLocation: string;
  sessionType: TrialSessionTypes;
  weekOf: string;
  ignoresConstraints?: boolean;
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

    const remainingCaseCounts = {
      [SESSION_TYPES.regular]:
        caseCountsAndSessionsByCity[city].remainingRegularCases,
      [SESSION_TYPES.small]:
        caseCountsAndSessionsByCity[city].remainingSmallCases,
    };

    const regularSessionConfig = {
      max: calendaringConfig.regularCaseMaxQuantity,
      min: calendaringConfig.regularCaseMinimumQuantity,
      sessionType: SESSION_TYPES.regular,
    };

    const smallSessionConfig = {
      max: calendaringConfig.smallCaseMaxQuantity,
      min: calendaringConfig.smallCaseMinimumQuantity,
      sessionType: SESSION_TYPES.small,
    };

    const hybridSessionConfig = {
      max: calendaringConfig.hybridCaseMaxQuantity,
      min: calendaringConfig.hybridCaseMinimumQuantity,
      sessionType: SESSION_TYPES.hybrid,
    };

    const [primarySessionConfig, secondarySessionConfig] =
      remainingCaseCounts[SESSION_TYPES.regular] >=
      remainingCaseCounts[SESSION_TYPES.small]
        ? [regularSessionConfig, smallSessionConfig]
        : [smallSessionConfig, regularSessionConfig];

    scheduleCases({
      caseCountsAndSessionsByCity,
      cityWasNotVisitedInLastTwoTerms,
      remainingCaseCounts,
      schedulingConfig: primarySessionConfig,
      trialLocation: city,
    });

    scheduleCases({
      caseCountsAndSessionsByCity,
      cityWasNotVisitedInLastTwoTerms,
      remainingCaseCounts,
      schedulingConfig: secondarySessionConfig,
      trialLocation: city,
    });

    if (
      remainingCaseCounts[SESSION_TYPES.regular] +
        remainingCaseCounts[SESSION_TYPES.small] >=
      calendaringConfig.hybridCaseMinimumQuantity
    ) {
      scheduleCases({
        caseCountsAndSessionsByCity,
        cityWasNotVisitedInLastTwoTerms,
        remainingCaseCounts,
        schedulingConfig: hybridSessionConfig,
        trialLocation: city,
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
      caseCountsAndSessionsByCity[city].prospectiveSessions.length === 0 &&
      (remainingCaseCounts[SESSION_TYPES.regular] > 0 ||
        remainingCaseCounts[SESSION_TYPES.small] > 0)
    ) {
      const containsRegularCase =
        remainingCaseCounts[SESSION_TYPES.regular] > 0;
      const containsSmallCase = remainingCaseCounts[SESSION_TYPES.small] > 0;
      const lowVolumeSessionType =
        containsRegularCase && containsSmallCase
          ? SESSION_TYPES.hybrid
          : containsRegularCase
            ? SESSION_TYPES.regular
            : SESSION_TYPES.small;

      addProspectiveTrialSession({
        caseCountsAndSessionsByCity,
        cityWasNotVisitedInLastTwoTerms,
        sessionType: lowVolumeSessionType,
        trialLocation: city,
      });

      remainingCaseCounts[SESSION_TYPES.regular] = 0;
      remainingCaseCounts[SESSION_TYPES.small] = 0;
    }
  }

  return {
    caseCountsAndSessionsByCity,
  };
};

const scheduleCases = ({
  caseCountsAndSessionsByCity,
  cityWasNotVisitedInLastTwoTerms,
  remainingCaseCounts,
  schedulingConfig,
  trialLocation,
}: {
  schedulingConfig: {
    min: number;
    max: number;
    sessionType: TrialSessionTypes;
  };
  trialLocation: string;
  cityWasNotVisitedInLastTwoTerms: boolean;
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity;
  remainingCaseCounts: {
    [SESSION_TYPES.small]: number;
    [SESSION_TYPES.regular]: number;
  };
}): void => {
  const [primaryCaseType, secondaryCaseType] =
    remainingCaseCounts[SESSION_TYPES.regular] >=
    remainingCaseCounts[SESSION_TYPES.small]
      ? [SESSION_TYPES.regular, SESSION_TYPES.small]
      : [SESSION_TYPES.small, SESSION_TYPES.regular];
  while (
    (schedulingConfig.sessionType === SESSION_TYPES.hybrid
      ? remainingCaseCounts[SESSION_TYPES.small] +
        remainingCaseCounts[SESSION_TYPES.regular]
      : remainingCaseCounts[schedulingConfig.sessionType]) >=
    schedulingConfig.min
  ) {
    addProspectiveTrialSession({
      caseCountsAndSessionsByCity,
      cityWasNotVisitedInLastTwoTerms,
      sessionType: schedulingConfig.sessionType,
      trialLocation,
    });

    if (schedulingConfig.sessionType !== SESSION_TYPES.hybrid) {
      if (
        remainingCaseCounts[schedulingConfig.sessionType] -
          schedulingConfig.max >
        0
      ) {
        remainingCaseCounts[schedulingConfig.sessionType] -=
          schedulingConfig.max;
      } else {
        remainingCaseCounts[schedulingConfig.sessionType] = 0;
      }
    } else {
      if (remainingCaseCounts[primaryCaseType] - schedulingConfig.max > 0) {
        remainingCaseCounts[primaryCaseType] -= schedulingConfig.max;
      } else {
        const sessionSpotsRemainder =
          schedulingConfig.max - remainingCaseCounts[primaryCaseType];

        remainingCaseCounts[primaryCaseType] = 0;

        remainingCaseCounts[secondaryCaseType] = Math.max(
          remainingCaseCounts[secondaryCaseType] - sessionSpotsRemainder,
          0,
        );
      }
    }
  }
};

const addProspectiveTrialSession = ({
  caseCountsAndSessionsByCity,
  cityWasNotVisitedInLastTwoTerms,
  sessionType,
  trialLocation,
}: {
  cityWasNotVisitedInLastTwoTerms: boolean;
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity;
  sessionType: TrialSessionTypes;
  trialLocation: string;
}): void => {
  caseCountsAndSessionsByCity[trialLocation].prospectiveSessions.push({
    cityWasNotVisitedInLastTwoTerms,
    sessionType,
    trialLocation,
  });
};
