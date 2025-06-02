import { Case } from '@shared/business/entities/cases/Case';
import { DOCKET_SECTION } from '@shared/business/entities/EntityConstants';
import { ENTERED_AND_SERVED_EVENT_CODES } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentConstants';
import { applicationContext } from '@web-api/applicationContext';
import { WorkItem } from '@shared/business/entities/WorkItem';
import { aggregatePartiesForService } from '@shared/business/utilities/aggregatePartiesForService';
import { upsertWorkItems } from '@web-api/persistence/postgres/workitems/upsertWorkItems';
import { updateCaseAutomaticBlock } from '@web-api/business/useCaseHelper/automaticBlock/updateCaseAutomaticBlock';
import { closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments } from '@web-api/business/useCaseHelper/docketEntry/closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';

export const fileAndServeDocumentOnOneCase = async ({
  caseEntity,
  docketEntryEntity,
  subjectCaseDocketNumber,
  user,
  caseHasDeadline = undefined,
}: {
  caseEntity: any;
  docketEntryEntity: any;
  subjectCaseDocketNumber: any;
  user: any;
  caseHasDeadline?: boolean;
}) => {
  const servedParties = aggregatePartiesForService(caseEntity);

  docketEntryEntity.setAsServed(servedParties.all);

  const isSubjectCase = subjectCaseDocketNumber === caseEntity.docketNumber;

  if (!docketEntryEntity.workItem || !isSubjectCase) {
    docketEntryEntity.workItem = new WorkItem(
      {
        assigneeId: null,
        assigneeName: null,
        docketEntry: {
          ...docketEntryEntity.toRawObject(),
          createdAt: docketEntryEntity.createdAt,
        },
        docketNumber: caseEntity.docketNumber,
        inProgress: true,
        section: DOCKET_SECTION,
        sentBy: user.name,
        sentByUserId: user.userId,
      },
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
    docketEntryEntity,
    leadDocketNumber: caseEntity.leadDocketNumber,
    user,
    workItemToUpdate,
  });

  docketEntryEntity.validate();

  caseEntity.updateDocketEntry(docketEntryEntity);

  caseEntity = await updateCaseAutomaticBlock({
    caseEntity,
    hasCaseDeadline: caseHasDeadline,
  });

  if (ENTERED_AND_SERVED_EVENT_CODES.includes(docketEntryEntity.eventCode)) {
    await closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
      applicationContext,
      caseEntity,
      eventCode: docketEntryEntity.eventCode,
    });
  }

  const validRawCaseEntity = await updateCaseAndAssociations({
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

  await upsertWorkItems({
    workItems: [workItemToUpdate.validate().toRawObject()],
  });
};
