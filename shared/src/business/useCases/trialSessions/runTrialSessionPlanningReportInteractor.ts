import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '../../../authorization/authorizationClientService';
import { capitalize } from 'lodash';
import { invert } from 'lodash';
import { TRIAL_CITIES, US_STATES } from '../../entities/EntityConstants';
import { UnauthorizedError } from '../../../errors/errors';

export const getPreviousTerm = (currentTerm, currentYear) => {
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

export const getTrialSessionPlanningReportData = async ({
  applicationContext,
  term,
  year,
}) => {
  const previousTerms = [];
  let currentTerm = term;
  let currentYear = year;
  for (let i = 0; i < 3; i++) {
    const previous = getPreviousTerm(currentTerm, currentYear);
    previousTerms.push(previous);
    currentTerm = previous.term;
    currentYear = previous.year;
  }

  const trialCities = [...TRIAL_CITIES.ALL];
  trialCities.sort((a, b) => {
    if (a.state === b.state) {
      return applicationContext.getUtilities().compareStrings(a.city, b.city);
    } else {
      return applicationContext.getUtilities().compareStrings(a.state, b.state);
    }
  });

  let allTrialSessions = await applicationContext
    .getPersistenceGateway()
    .getTrialSessions({ applicationContext });

  allTrialSessions = allTrialSessions.filter(session =>
    ['Regular', 'Small', 'Hybrid'].includes(session.sessionType),
  );

  const trialLocationData = [];
  for (const trialLocation of trialCities) {
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

    const previousTermsData = [];
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

      const previousTermSessionList = [];
      previousTermSessions.forEach(previousTermSession => {
        if (
          previousTermSession &&
          previousTermSession.sessionType &&
          previousTermSession.judge
        ) {
          const sessionTypeChar = previousTermSession.sessionType.charAt(0);
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

    trialLocationData.push({
      allCaseCount,
      previousTermsData,
      regularCaseCount,
      smallCaseCount,
      stateAbbreviation,
      trialCityState,
    });
  }

  return { previousTerms, trialLocationData };
};

/**
 * runTrialSessionPlanningReportInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @returns {Promise} the promise of the runTrialSessionPlanningReportInteractor call
 */
export const runTrialSessionPlanningReportInteractor = async (
  applicationContext: IApplicationContext,
  { term, year }: { term: string; year: string },
) => {
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
