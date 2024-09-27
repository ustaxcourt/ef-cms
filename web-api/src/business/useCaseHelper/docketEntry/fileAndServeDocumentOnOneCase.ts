import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { DOCKET_SECTION } from '../../../../../shared/src/business/entities/EntityConstants';
import { ENTERED_AND_SERVED_EVENT_CODES } from '../../../../../shared/src/business/entities/courtIssuedDocument/CourtIssuedDocumentConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { WorkItem } from '../../../../../shared/src/business/entities/WorkItem';
import { aggregatePartiesForService } from '../../../../../shared/src/business/utilities/aggregatePartiesForService';
import { saveWorkItem } from '@web-api/persistence/postgres/workitems/saveWorkItem';

export const fileAndServeDocumentOnOneCase = async ({
  applicationContext,
  caseEntity,
  docketEntryEntity,
  subjectCaseDocketNumber,
  user,
}: {
  applicationContext: ServerApplicationContext;
  caseEntity: any;
  docketEntryEntity: any;
  subjectCaseDocketNumber: any;
  user: any;
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
        associatedJudgeId: caseEntity.associatedJudgeId,
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
      { caseEntity },
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
      authorizedUser: user,
      caseToUpdate: caseEntity,
    });

  return new Case(validRawCaseEntity, {
    authorizedUser: user,
  });
};

const completeWorkItem = async ({
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

  await saveWorkItem({
    workItem: workItemToUpdate.validate().toRawObject(),
  });
};
