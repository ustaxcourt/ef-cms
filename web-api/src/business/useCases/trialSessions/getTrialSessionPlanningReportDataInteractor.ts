import {
  PreviousTerm,
  TrialLocationData,
} from '@shared/business/utilities/trialSessionPlanningReport/trialSessionPlanningReportDataTypes';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import {
  SESSION_TYPES,
  TRIAL_CITIES,
  US_STATES,
} from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { capitalize, invert } from 'lodash';
import { getBlockedCases } from '@web-api/persistence/elasticsearch/getBlockedCases';

export const getTrialSessionPlanningReportDataInteractor = async (
  applicationContext: ServerApplicationContext,
  { term, year }: { term: string; year: string },
  authorizedUser: UnknownAuthUser,
): Promise<{
  previousTerms: PreviousTerm[];
  trialLocationData: TrialLocationData[];
}> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { previousTerms, trialLocationData } =
    await getTrialSessionPlanningReportData({
      applicationContext,
      term,
      year,
    });

  return {
    previousTerms,
    trialLocationData,
  };
};

const getTrialSessionPlanningReportData = async ({
  applicationContext,
  term,
  year,
}: {
  applicationContext: ServerApplicationContext;
  term: string;
  year: string;
}): Promise<{
  previousTerms: PreviousTerm[];
  trialLocationData: TrialLocationData[];
}> => {
  const previousTerms: PreviousTerm[] = [];
  let currentTerm: string = term;
  let currentYear: string = year;
  for (let i = 0; i < 3; i++) {
    const previous = getPreviousTerm(currentTerm, currentYear);
    previousTerms.push(previous);
    currentTerm = previous.term;
    currentYear = previous.year;
  }

  const trialCities = TRIAL_CITIES.ALL.sort((a, b) => {
    return applicationContext.getUtilities().compareStrings(a.city, b.city);
  });

  const allTrialSessions = (
    await applicationContext
      .getPersistenceGateway()
      .getTrialSessions({ applicationContext })
  ).filter(ts => ts.isCalendared);

  const filteredTrialSessions = allTrialSessions.filter(session =>
    ['Regular', 'Small', 'Hybrid', 'Hybrid-S'].includes(session.sessionType),
  );

  const specialTrialSessions = allTrialSessions.filter(
    session =>
      session.sessionType === 'Special' &&
      session.termYear === year &&
      session.term.toLocaleLowerCase() === term.toLocaleLowerCase(),
  );

  const specialTrialSessionsCounts = specialTrialSessions.reduce(
    (allSessions, session) => {
      const { trialLocation } = session;
      if (!trialLocation) return allSessions;
      allSessions[trialLocation] = (allSessions[trialLocation] || 0) + 1;
      return allSessions;
    },
    {},
  );

  const trialLocationData: TrialLocationData[] = await Promise.all(
    trialCities.map(trialLocation =>
      getTrialLocation(applicationContext, {
        allTrialSessions,
        filteredTrialSessions,
        previousTerms,
        specialTrialSessionsCounts,
        trialLocation,
      }),
    ),
  );

  return { previousTerms, trialLocationData };
};

const getPreviousTerm = (
  currentTerm: string,
  currentYear: string,
): PreviousTerm => {
  const terms = [
    `fall ${+currentYear - 1}`,
    `winter ${currentYear}`,
    `spring ${currentYear}`,
    `fall ${currentYear}`,
  ];
  const termsReversed = terms.reverse();
  const termI = terms.findIndex(t => `${currentTerm} ${currentYear}` === t);
  const [term, year] = termsReversed[termI + 1].split(' ');

  const termDisplay = `${capitalize(term)} ${year}`;
  return {
    term,
    termDisplay,
    year,
  };
};

const getTrialLocation = async (
  applicationContext: ServerApplicationContext,
  {
    allTrialSessions,
    filteredTrialSessions,
    previousTerms,
    specialTrialSessionsCounts,
    trialLocation,
  }: {
    allTrialSessions: RawTrialSession[];
    trialLocation: { city: string; state: string };
    previousTerms: PreviousTerm[];
    filteredTrialSessions: RawTrialSession[];
    specialTrialSessionsCounts: { [key: string]: number };
  },
): Promise<TrialLocationData> => {
  const trialCityState = `${trialLocation.city}, ${trialLocation.state}`;
  const trialCityStateStripped = trialCityState.replace(/[\s.,]/g, '');
  const stateAbbreviation = invert(US_STATES)[trialLocation.state];

  const eligibleCasesSmall = await applicationContext
    .getPersistenceGateway()
    .getEligibleCasesForTrialCity({
      applicationContext,
      procedureType: 'Small',
      trialCity: trialCityStateStripped,
    });

  const eligibleCasesRegular = await applicationContext
    .getPersistenceGateway()
    .getEligibleCasesForTrialCity({
      applicationContext,
      procedureType: 'Regular',
      trialCity: trialCityStateStripped,
    });

  const blockedCasesResult = await getBlockedCases({
    trialLocation: trialCityState,
  });

  const smallCaseCount = eligibleCasesSmall.length;
  const regularCaseCount = eligibleCasesRegular.length;
  const allCaseCount = smallCaseCount + regularCaseCount;
  const blockedCaseCount = blockedCasesResult.length;
  const specialCaseCount = specialTrialSessionsCounts[trialCityState] || 0;

  const previousTermsDataInformation: RawTrialSession[][] = [];
  previousTerms.forEach(previousTerm => {
    const previousTermSessions = filteredTrialSessions.filter(
      trialSession =>
        trialSession.term.toLowerCase() === previousTerm.term.toLowerCase() &&
        trialSession.termYear === previousTerm.year &&
        trialSession.trialLocation === trialCityState,
    );

    previousTermSessions.sort((a, b) => {
      return applicationContext
        .getUtilities()
        .compareISODateStrings(a.startDate, b.startDate);
    });

    const previousTermSessionList: RawTrialSession[] = [];
    previousTermSessions.forEach(previousTermSession => {
      if (
        previousTermSession &&
        previousTermSession.sessionType &&
        previousTermSession.judge
      ) {
        previousTermSessionList.push(previousTermSession);
      }
    });
    previousTermsDataInformation.push(previousTermSessionList);
  });

  const lastVisitedDate: string | undefined =
    getLatestDateFromPreviousTerm(previousTermsDataInformation[2]) ||
    getLatestDateForTrialSessionLocation({
      allTrialSessions,
      applicationContext,
      trialCityState,
    });

  const previousTermsData = previousTermsDataInformation.map(prevTermArray => {
    return prevTermArray.map(prevTerm => {
      const sessionTypeChar =
        prevTerm.sessionType === SESSION_TYPES.hybridSmall
          ? 'HS'
          : prevTerm.sessionType.charAt(0);
      const strippedJudgeName = prevTerm.judge!.name.replace('Judge ', '');
      return `(${sessionTypeChar}) ${strippedJudgeName}`;
    });
  });

  return {
    allCaseCount,
    blockedCaseCount,
    lastVisitedDate,
    previousTermsData,
    regularCaseCount,
    smallCaseCount,
    specialCaseCount,
    stateAbbreviation,
    trialCityState,
  };
};

function getLatestDateFromPreviousTerm(
  prevTerms: RawTrialSession[],
): string | undefined {
  if (prevTerms.length === 0) return undefined;

  const lastTermDate = prevTerms[prevTerms.length - 1].startDate;
  return lastTermDate;
}

function getLatestDateForTrialSessionLocation({
  allTrialSessions,
  applicationContext,
  trialCityState,
}: {
  allTrialSessions: RawTrialSession[];
  applicationContext: ServerApplicationContext;
  trialCityState: string;
}): string | undefined {
  const allTrialSessionsForLocation = allTrialSessions.filter(
    ts => ts.trialLocation === trialCityState,
  );

  if (!allTrialSessionsForLocation.length) return;

  allTrialSessionsForLocation.sort((a, b) => {
    return applicationContext
      .getUtilities()
      .compareISODateStrings(a.startDate, b.startDate);
  });

  return allTrialSessionsForLocation[allTrialSessionsForLocation.length - 1]
    .startDate;
}
