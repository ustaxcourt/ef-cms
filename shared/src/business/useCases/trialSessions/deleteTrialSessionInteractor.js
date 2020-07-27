const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * deleteTrialSessionInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.trialSessionId the id of the trial session
 * @returns {Promise} the promise of the deleteTrialSessionInteractor call
 */
exports.deleteTrialSessionInteractor = async ({
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

  if (!trialSession) {
    throw new Error('trial session not found');
  }

  const trialSessionEntity = new TrialSession(trialSession, {
    applicationContext,
  });

  if (
    trialSessionEntity.startDate <
    applicationContext.getUtilities().createISODateString()
  ) {
    throw new Error('Trial session cannot be updated after its start date');
  }

  if (trialSessionEntity.isCalendared) {
    throw new Error('Trial session cannot be deleted after it is calendared');
  }

  await applicationContext.getPersistenceGateway().deleteTrialSession({
    applicationContext,
    trialSessionId,
  });

  if (trialSessionEntity.judge) {
    await applicationContext
      .getPersistenceGateway()
      .deleteTrialSessionWorkingCopy({
        applicationContext,
        trialSessionId,
        userId: trialSessionEntity.judge.userId,
      });
  }

  for (const order of trialSessionEntity.caseOrder) {
    const myCase = await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({
        applicationContext,
        docketNumber: order.docketNumber,
      });

    const caseEntity = new Case(myCase, { applicationContext });

    caseEntity.removeFromTrial();

    await applicationContext
      .getPersistenceGateway()
      .createCaseTrialSortMappingRecords({
        applicationContext,
        caseId: caseEntity.caseId,
        caseSortTags: caseEntity.generateTrialSortTags(),
      });

    await applicationContext.getPersistenceGateway().updateCase({
      applicationContext,
      caseToUpdate: caseEntity.validate().toRawObject(),
    });
  }

  return trialSessionEntity.toRawObject();
};
