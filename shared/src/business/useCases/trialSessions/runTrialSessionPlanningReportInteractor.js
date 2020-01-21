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
    `fall ${+currentYear - 1}`,
    `winter ${currentYear}`,
    `spring ${currentYear}`,
    `fall ${currentYear}`,
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

  const contentHtml = await applicationContext
    .getTemplateGenerators()
    .generateTrialSessionPlanningReportTemplate({
      applicationContext,
      content: {
        previousTerms: reportData.previousTerms,
        rows: reportData.trialLocationData,
        selectedTerm: term,
        selectedYear: year,
      },
    });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor({
      applicationContext,
      contentHtml,
      headerHtml: ' ',
    });

  return pdf;
};

exports.getPreviousTerm = getPreviousTerm;
exports.getTrialSessionPlanningReportData = getTrialSessionPlanningReportData;
