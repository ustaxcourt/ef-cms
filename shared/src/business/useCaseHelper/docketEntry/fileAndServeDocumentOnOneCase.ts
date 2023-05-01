import { Case } from '../../entities/cases/Case';
import { DOCKET_SECTION } from '../../entities/EntityConstants';
import { ENTERED_AND_SERVED_EVENT_CODES } from '../../entities/courtIssuedDocument/CourtIssuedDocumentConstants';
import { WorkItem } from '../../entities/WorkItem';
import { aggregatePartiesForService } from '../../utilities/aggregatePartiesForService';

export const fileAndServeDocumentOnOneCase = async ({
  applicationContext,
  caseEntity,
  docketEntryEntity,
  subjectCaseDocketNumber,
  user,
}) => {
  const servedParties = aggregatePartiesForService(caseEntity);

  docketEntryEntity.setAsServed(servedParties.all);

  const isSubjectCase = subjectCaseDocketNumber === caseEntity.docketNumber;

  if (!docketEntryEntity.workItem || !isSubjectCase) {
    docketEntryEntity.workItem = new WorkItem(
      {
        assigneeId: null,
        assigneeName: null,
        associatedJudge: caseEntity.associatedJudge,
        caseStatus: caseEntity.status,
        caseTitle: Case.getCaseTitle(caseEntity.caseCaption),
        docketEntry: {
          ...docketEntryEntity.toRawObject(),
          createdAt: docketEntryEntity.createdAt,
        },
        docketNumber: caseEntity.docketNumber,
        docketNumberWithSuffix: caseEntity.docketNumberWithSuffix,
        hideFromPendingMessages: true,
        inProgress: true,
        section: DOCKET_SECTION,
        sentBy: user.name,
        sentByUserId: user.userId,
        trialDate: caseEntity.trialDate,
        trialLocation: caseEntity.trialLocation,
      },
      { applicationContext },
      caseEntity,
    );
  }

  if (
    !caseEntity.getDocketEntryById({
      docketEntryId: docketEntryEntity.docketEntryId,
    })
  ) {
    caseEntity.addDocketEntry(docketEntryEntity);
  }

  const workItemToUpdate = docketEntryEntity.workItem;

  await completeWorkItem({
    applicationContext,
    docketEntryEntity,
    leadDocketNumber: caseEntity.leadDocketNumber,
    user,
    workItemToUpdate,
  });

  docketEntryEntity.validate();

  caseEntity.updateDocketEntry(docketEntryEntity);

  caseEntity = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAutomaticBlock({
      applicationContext,
      caseEntity,
    });

  if (ENTERED_AND_SERVED_EVENT_CODES.includes(docketEntryEntity.eventCode)) {
    await applicationContext
      .getUseCaseHelpers()
      .closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
        applicationContext,
        caseEntity,
        eventCode: docketEntryEntity.eventCode,
      });
  }

  const validRawCaseEntity = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });

  return new Case(validRawCaseEntity, { applicationContext });
};

const completeWorkItem = async ({
  applicationContext,
  docketEntryEntity,
  leadDocketNumber,
  user,
  workItemToUpdate,
}) => {
  Object.assign(workItemToUpdate, {
    docketEntry: {
      ...docketEntryEntity.validate().toRawObject(),
    },
  });

  workItemToUpdate.leadDocketNumber = leadDocketNumber;

  workItemToUpdate.assignToUser({
    assigneeId: user.userId,
    assigneeName: user.name,
    section: user.section,
    sentBy: user.name,
    sentBySection: user.section,
    sentByUserId: user.userId,
  });

  workItemToUpdate.setAsCompleted({ message: 'completed', user });

  await applicationContext.getPersistenceGateway().saveWorkItem({
    applicationContext,
    workItem: workItemToUpdate.validate().toRawObject(),
  });

  await applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox({
    applicationContext,
    section: user.section,
    userId: user.userId,
    workItem: workItemToUpdate.validate().toRawObject(),
  });
};
