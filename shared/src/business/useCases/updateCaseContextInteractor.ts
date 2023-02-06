import { CASE_STATUS_TYPES } from '../entities/EntityConstants';
import { Case } from '../entities/cases/Case';
import { CaseDeadline } from '../entities/CaseDeadline';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { TrialSession } from '../entities/trialSessions/TrialSession';
import { UnauthorizedError } from '../../errors/errors';

/**
 * updateCaseContextInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.associatedJudge the associated judge to set on the case
 * @param {string} providers.caseCaption the caption to set on the case
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {object} providers.caseStatus the status to set on the case
 * @returns {object} the updated case data
 */
export const updateCaseContextInteractor = async (
  applicationContext: IApplicationContext,
  {
    associatedJudge,
    caseCaption,
    caseStatus,
    docketNumber,
  }: {
    associatedJudge?: string;
    caseCaption?: string;
    caseStatus?: string;
    docketNumber: string;
  },
) => {
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

  const transaction = applicationContext
    .getPersistenceGateway()
    .createTransaction();

  // TODO: is there a way we can do this without having to loop over EVERY work item on the case just
  // because we updated the judge?
  if (associatedJudge !== oldCase.associatedJudge) {
    const workItems = await applicationContext
      .getPersistenceGateway()
      .getWorkItemsByDocketNumber({
        applicationContext,
        docketNumber: oldCase.docketNumber,
      });

    await Promise.all(
      workItems.map(workItem =>
        applicationContext
          .getUseCaseHelpers()
          .updateAssociatedJudgeOnWorkItems({
            applicationContext,
            associatedJudge,
            workItemId: workItem.workItemid,
          }),
      ),
    );
  }

  if (associatedJudge !== oldCase.associatedJudge) {
    const deadlines = await applicationContext
      .getPersistenceGateway()
      .getCaseDeadlinesByDocketNumber({
        applicationContext,
        docketNumber: oldCase.docketNumber,
      });

    const updatedDeadlines = deadlines.map(deadline => ({
      ...deadline,
      associatedJudge,
    }));

    const validCaseDeadlines = CaseDeadline.validateRawCollection(
      updatedDeadlines,
      {
        applicationContext,
      },
    );

    await Promise.all(
      validCaseDeadlines.map(caseDeadline =>
        applicationContext.getPersistenceGateway().createCaseDeadline({
          applicationContext,
          caseDeadline,
        }),
      ),
    );
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
        transaction,
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
          docketNumber: newCase.docketNumber,
          transaction,
        });
    }

    if (newCase.isReadyForTrial() && !oldCase.trialSessionId) {
      await applicationContext
        .getPersistenceGateway()
        .createCaseTrialSortMappingRecords({
          applicationContext,
          caseSortTags: newCase.generateTrialSortTags(),
          docketNumber: newCase.docketNumber,
          transaction,
        });
    }
  }
  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: newCase.validate().toRawObject(),
    transaction,
  });

  await transaction.commit({ applicationContext });

  return newCase.toRawObject();
};
