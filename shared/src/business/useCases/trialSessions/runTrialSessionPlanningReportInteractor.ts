import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import {
  SESSION_TYPES,
  TRIAL_CITIES,
  US_STATES,
} from '../../entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { capitalize, invert } from 'lodash';

export type PreviousTerm = {
  term: string;
  termDisplay: string;
  year: string;
};

export type TrialLocationData = {
  allCaseCount: number;
  previousTermsData: string[][];
  regularCaseCount: number;
  smallCaseCount: number;
  stateAbbreviation: string;
  trialCityState: string;
};

export const runTrialSessionPlanningReportInteractor = async (
  applicationContext: IApplicationContext,
  { term, year }: { term: string; year: string },
): Promise<{
  fileId: string;
  url: string;
}> => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const reportData = await getTrialSessionPlanningReportData({
    applicationContext,
    term,
    year,
  });

  const trialSessionPlanningReport = await applicationContext
    .getDocumentGenerators()
    .trialSessionPlanningReport({
      applicationContext,
      data: {
        locationData: reportData.trialLocationData,
        previousTerms: reportData.previousTerms,
        term: `${capitalize(term)} ${year}`,
      },
    });

  return await applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl({
    applicationContext,
    file: trialSessionPlanningReport,
    useTempBucket: true,
  });
};

const getTrialSessionPlanningReportData = async ({
  applicationContext,
  term,
  year,
}: {
  applicationContext: IApplicationContext;
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
  ).filter(session =>
    ['Regular', 'Small', 'Hybrid', 'Hybrid-S'].includes(session.sessionType),
  );

  const trialLocationData: TrialLocationData[] = await Promise.all(
    trialCities.map(trialLocation =>
      getTrialLocation(applicationContext, {
        allTrialSessions,
        previousTerms,
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
  applicationContext: IApplicationContext,
  {
    allTrialSessions,
    previousTerms,
    trialLocation,
  }: {
    trialLocation: { city: string; state: string };
    previousTerms: PreviousTerm[];
    allTrialSessions: RawTrialSession[];
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

  const smallCaseCount = eligibleCasesSmall.length;
  const regularCaseCount = eligibleCasesRegular.length;
  const allCaseCount = smallCaseCount + regularCaseCount;

  const previousTermsData: string[][] = [];
  previousTerms.forEach(previousTerm => {
    const previousTermSessions = allTrialSessions.filter(
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

    const previousTermSessionList: string[] = [];
    previousTermSessions.forEach(previousTermSession => {
      if (
        previousTermSession &&
        previousTermSession.sessionType &&
        previousTermSession.judge
      ) {
        const sessionTypeChar =
          previousTermSession.sessionType === SESSION_TYPES.hybridSmall
            ? 'HS'
            : previousTermSession.sessionType.charAt(0);
        const strippedJudgeName = previousTermSession.judge.name.replace(
          'Judge ',
          '',
        );
        previousTermSessionList.push(
          `(${sessionTypeChar}) ${strippedJudgeName}`,
        );
      }
    });
    previousTermsData.push(previousTermSessionList);
  });

  return {
    allCaseCount,
    previousTermsData,
    regularCaseCount,
    smallCaseCount,
    stateAbbreviation,
    trialCityState,
  };
};
