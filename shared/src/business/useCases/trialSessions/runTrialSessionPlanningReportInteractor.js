const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { ContactFactory } = require('../../entities/contacts/ContactFactory');
const { invert } = require('lodash');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

const getPreviousTerm = (currentTerm, currentYear) => {
  const terms = [
    `winter ${+currentYear - 1}`,
    `spring ${currentYear}`,
    `fall ${currentYear}`,
    `winter ${currentYear}`,
  ];
  const termsReversed = terms.reverse();
  const termI = terms.findIndex(t => `${currentTerm} ${currentYear}` === t);
  const [term, year] = termsReversed[termI + 1].split(' ');
  return {
    term,
    year,
  };
};

const getTrialSessionPlanningReportData = async ({
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

  const trialCities = TrialSession.TRIAL_CITIES.ALL;
  trialCities.sort((a, b) => {
    if (a.state === b.state) {
      return a.city.localeCompare(b.city);
    } else {
      return a.state.localeCompare(b.state);
    }
  });

  const allTrialSessions = await applicationContext
    .getPersistenceGateway()
    .getTrialSessions({ applicationContext });

  const trialLocationData = [];
  for (const trialLocation of trialCities) {
    const trialCityState = `${trialLocation.city}, ${trialLocation.state}`;
    const trialCityStateStripped = trialCityState.replace(/[\s.,]/g, '');
    const stateAbbreviation = invert(ContactFactory.US_STATES)[
      trialLocation.state
    ];

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
      const previousTermSession = allTrialSessions.find(
        trialSession =>
          trialSession.term === previousTerm.term &&
          trialSession.termYear === previousTerm.year &&
          trialSession.trialLocation === trialCityState,
      );

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
        previousTermsData.push(`(${sessionTypeChar}) ${strippedJudgeName}`);
      } else {
        previousTermsData.push('');
      }
    });

    trialLocationData.push({
      allCaseCount: allCaseCount,
      previousTermsData,
      regularCaseCount: regularCaseCount,
      smallCaseCount: smallCaseCount,
      stateAbbreviation,
      trialCityState,
    });
  }

  return { previousTerms, trialLocationData };
};

/**
 * runTrialSessionPlanningReportInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise} the promise of the runTrialSessionPlanningReportInteractor call
 */
exports.runTrialSessionPlanningReportInteractor = async ({
  applicationContext,
  term,
  year,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const reportData = await getTrialSessionPlanningReportData({
    applicationContext,
    term,
    year,
  });

  return await applicationContext.getUseCases().generatePdfFromHtmlInteractor({
    applicationContext,
    contentHtml: reportData,
    headerHtml: 'HEADER',
  });
};

exports.getPreviousTerm = getPreviousTerm;
exports.getTrialSessionPlanningReportData = getTrialSessionPlanningReportData;
