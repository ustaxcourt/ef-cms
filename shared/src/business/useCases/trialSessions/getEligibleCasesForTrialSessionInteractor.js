const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const {
  TRIAL_SESSION_ELIGIBLE_CASES_BUFFER,
} = require('../../entities/EntityConstants');
const { Case } = require('../../entities/cases/Case');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * get eligible cases for trial session
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.trialSessionId the id of the trial session to get the eligible cases
 * @returns {Promise} the promise of the getEligibleCasesForTrialSession call
 */
exports.getEligibleCasesForTrialSessionInteractor = async ({
  applicationContext,
  trialSessionId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  // Some manually added cases are considered calendared even when the
  // trial session itself is not considered calendared (see issue #3254).
  let calendaredCases = [];
  if (trialSession.isCalendared === false && trialSession.caseOrder) {
    calendaredCases = await applicationContext
      .getUseCases()
      .getCalendaredCasesForTrialSessionInteractor({
        applicationContext,
        trialSessionId,
      });
  }

  const trialSessionEntity = new TrialSession(trialSession, {
    applicationContext,
  });

  trialSessionEntity.validate();

  const eligibleCases = await applicationContext
    .getPersistenceGateway()
    .getEligibleCasesForTrialSession({
      applicationContext,
      limit:
        trialSessionEntity.maxCases +
        TRIAL_SESSION_ELIGIBLE_CASES_BUFFER -
        calendaredCases.length,
      skPrefix: trialSessionEntity.generateSortKeyPrefix(),
    });

  let eligibleCasesFiltered = calendaredCases
    .concat(eligibleCases)
    .map(rawCase => {
      return new Case(rawCase, { applicationContext }).validate().toRawObject();
    });

  return eligibleCasesFiltered;
};
