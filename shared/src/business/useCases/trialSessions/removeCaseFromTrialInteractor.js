const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * removeCaseFromTrialInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to remove from trial
 * @param {string} providers.disposition the reason the case is being removed from trial
 * @param {string} providers.trialSessionId the id of the trial session containing the case to set to removedFromTrial
 * @returns {Promise} the promise of the getCalendaredCasesForTrialSession call
 */
exports.removeCaseFromTrialInteractor = async ({
  applicationContext,
  associatedJudge,
  caseStatus,
  disposition,
  docketNumber,
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

  const trialSessionEntity = new TrialSession(trialSession, {
    applicationContext,
  });

  if (trialSessionEntity.isCalendared) {
    trialSessionEntity.removeCaseFromCalendar({ disposition, docketNumber });
  } else {
    trialSessionEntity.deleteCaseFromCalendar({ docketNumber });
  }

  await applicationContext.getPersistenceGateway().updateTrialSession({
    applicationContext,
    trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
  });

  const myCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(myCase, { applicationContext });

  if (!caseEntity.isHearing(trialSessionId)) {
    caseEntity.removeFromTrial(caseStatus, associatedJudge);

    await applicationContext.getPersistenceGateway().setPriorityOnAllWorkItems({
      applicationContext,
      docketNumber: caseEntity.docketNumber,
      highPriority: false,
    });

    if (caseEntity.isReadyForTrial()) {
      await applicationContext
        .getPersistenceGateway()
        .createCaseTrialSortMappingRecords({
          applicationContext,
          caseSortTags: caseEntity.generateTrialSortTags(),
          docketNumber: caseEntity.docketNumber,
        });
    }

    await applicationContext
      .getUseCaseHelpers()
      .updateCaseAutomaticBlock({ applicationContext, caseEntity });
  } else {
    caseEntity.removeFromHearing(trialSessionId);
  }

  const updatedCase = await applicationContext
    .getPersistenceGateway()
    .updateCase({
      applicationContext,
      caseToUpdate: caseEntity.validate().toRawObject(),
    });

  return new Case(updatedCase, { applicationContext }).validate().toRawObject();
};
