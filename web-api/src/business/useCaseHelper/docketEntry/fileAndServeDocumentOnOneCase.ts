import { Case } from '@shared/business/entities/cases/Case';
import {
  DOCKET_SECTION,
  ENTERED_AND_SERVED_EVENT_CODES,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@web-api/applicationContext';
import { WorkItem } from '@shared/business/entities/WorkItem';
import { aggregatePartiesForService } from '@shared/business/utilities/aggregatePartiesForService';
import { upsertWorkItems } from '@web-api/persistence/postgres/workitems/upsertWorkItems';
import { updateCaseAutomaticBlock } from '@web-api/business/useCaseHelper/automaticBlock/updateCaseAutomaticBlock';
import { closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments } from '@web-api/business/useCaseHelper/docketEntry/closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { getWorkItemByDocketNumberAndDocketEntryId } from '@web-api/persistence/postgres/workitems/getWorkItemByDocketNumberAndDocketEntryId';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { AuthUser } from 'shared/src/business/entities/authUser/AuthUser';

export const fileAndServeDocumentOnOneCase = async ({
  caseEntity,
  docketEntryEntity,
  user,
  caseHasDeadline = undefined,
}: {
  caseEntity: Case;
  docketEntryEntity: DocketEntry;
  user: AuthUser;
  caseHasDeadline?: boolean;
}): Promise<Case> => {
  const servedParties = aggregatePartiesForService(caseEntity);

  docketEntryEntity.setAsServed(servedParties.all);

  let workItem = await getWorkItemByDocketNumberAndDocketEntryId({
    docketNumber: caseEntity.docketNumber,
    docketEntryId: docketEntryEntity.docketEntryId,
  });

  if (!workItem) {
    workItem = new WorkItem({
      assigneeId: null,
      assigneeName: null,
      docketEntryId: docketEntryEntity.docketEntryId,
      docketNumber: caseEntity.docketNumber,
      inProgress: true,
      section: DOCKET_SECTION,
      sentBy: user.name,
      sentByUserId: user.userId,
    });
  }

  if (
    !caseEntity.getDocketEntryById({
      docketEntryId: docketEntryEntity.docketEntryId,
    })
  ) {
    caseEntity.addDocketEntry(docketEntryEntity);
  }

  await completeWorkItem({
    user,
    workItemToUpdate: workItem,
    docketEntryEntity,
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
    authorizedUser: user,
    caseToUpdate: caseEntity,
  });

  return new Case(validRawCaseEntity, {
    authorizedUser: user,
  });
};

const completeWorkItem = async ({
  user,
  workItemToUpdate,
  docketEntryEntity,
}): Promise<void> => {
  workItemToUpdate.assignToUser({
    assigneeId: user.userId,
    assigneeName: user.name,
    section: WorkItem.getWorkItemSectionFromUserSection({
      section: user.section,
      documentTitle: docketEntryEntity.documentTitle,
    }),
    sentBy: user.name,
    sentBySection: user.section,
    sentByUserId: user.userId,
  });

  workItemToUpdate.setAsCompleted({ message: 'completed', user });

  await upsertWorkItems({
    workItems: [workItemToUpdate.validate().toRawObject()],
  });
};
