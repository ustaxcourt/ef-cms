const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { CASE_STATUS_TYPES } = require('../entities/EntityConstants');
const { TrialSession } = require('../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * updateCaseContextInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.associatedJudge the associated judge to set on the case
 * @param {string} providers.caseCaption the caption to set on the case
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {object} providers.caseStatus the status to set on the case
 * @returns {object} the updated case data
 */
exports.updateCaseContextInteractor = async ({
  applicationContext,
  associatedJudge,
  caseCaption,
  caseStatus,
  docketNumber,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.UPDATE_CASE_CONTEXT)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  const oldCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({ applicationContext, docketNumber });

  const newCase = new Case(oldCase, { applicationContext });

  if (caseCaption) {
    newCase.setCaseCaption(caseCaption);
  }
  if (caseStatus) {
    newCase.setCaseStatus(caseStatus);
  }
  if (associatedJudge) {
    newCase.setAssociatedJudge(associatedJudge);
  }

  // if this case status is changing FROM calendared
  // we need to remove it from the trial session
  if (caseStatus !== oldCase.status) {
    if (oldCase.status === CASE_STATUS_TYPES.calendared) {
      const disposition = `Status was changed to ${caseStatus}`;

      const trialSession = await applicationContext
        .getPersistenceGateway()
        .getTrialSessionById({
          applicationContext,
          trialSessionId: oldCase.trialSessionId,
        });

      const trialSessionEntity = new TrialSession(trialSession, {
        applicationContext,
      });

      trialSessionEntity.removeCaseFromCalendar({
        disposition,
        docketNumber: oldCase.docketNumber,
      });

      await applicationContext.getPersistenceGateway().updateTrialSession({
        applicationContext,
        trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
      });

      newCase.removeFromTrialWithAssociatedJudge(associatedJudge);
    } else if (
      oldCase.status === CASE_STATUS_TYPES.generalDocketReadyForTrial
    ) {
      await applicationContext
        .getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords({
          applicationContext,
          caseId: newCase.caseId,
        });
    }

    if (caseStatus === CASE_STATUS_TYPES.generalDocketReadyForTrial) {
      await applicationContext
        .getPersistenceGateway()
        .createCaseTrialSortMappingRecords({
          applicationContext,
          caseId: newCase.caseId,
          caseSortTags: newCase.generateTrialSortTags(),
        });
    }
  }

  const updatedCase = await applicationContext
    .getPersistenceGateway()
    .updateCase({
      applicationContext,
      caseToUpdate: newCase.validate().toRawObject(),
    });

  return new Case(updatedCase, { applicationContext }).validate().toRawObject();
};
