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
      regular: caseCountsAndSessionsByCity[city].remainingRegularCases,
      small: caseCountsAndSessionsByCity[city].remainingSmallCases,
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
      remainingCaseCounts.regular >= remainingCaseCounts.small
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

    // Since the min of reg cases is 40, and the min of small cases is 40,
    // and the sum of these two values is below the hybrid case max of 100,
    // we can safely assume that if the combination of remaining regular
    // cases and remaining small cases is above the minimum of 50, we can
    // assign all of those remaining cases to a hybrid session.
    if (
      remainingCaseCounts.regular + remainingCaseCounts.small >=
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
      (remainingCaseCounts.regular > 0 || remainingCaseCounts.small > 0)
    ) {
      const containsRegularCase = remainingCaseCounts.regular > 0;
      const containsSmallCase = remainingCaseCounts.small > 0;
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

      remainingCaseCounts.regular = 0;
      remainingCaseCounts.small = 0;
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
  remainingCaseCounts: { small: number; regular: number };
}): void => {
  const [primaryCaseType, secondaryCaseType] =
    remainingCaseCounts.regular >= remainingCaseCounts.small
      ? [SESSION_TYPES.regular.toLowerCase(), SESSION_TYPES.small.toLowerCase()]
      : [
          SESSION_TYPES.small.toLowerCase(),
          SESSION_TYPES.regular.toLowerCase(),
        ];
  while (
    (schedulingConfig.sessionType === SESSION_TYPES.hybrid
      ? remainingCaseCounts.small + remainingCaseCounts.regular
      : remainingCaseCounts[schedulingConfig.sessionType.toLowerCase()]) >=
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
        remainingCaseCounts[schedulingConfig.sessionType.toLowerCase()] -
          schedulingConfig.max >
        0
      ) {
        remainingCaseCounts[schedulingConfig.sessionType.toLowerCase()] -=
          schedulingConfig.max;
      } else {
        remainingCaseCounts[schedulingConfig.sessionType.toLowerCase()] = 0;
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
