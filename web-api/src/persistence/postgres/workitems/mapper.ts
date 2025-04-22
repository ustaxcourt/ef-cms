import { Case } from '@shared/business/entities/cases/Case';
import { RawWorkItem, WorkItem } from '@shared/business/entities/WorkItem';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import { NewWorkItemKysely } from '@web-api/persistence/postgres/workitems/schema';

function pickFields(workItem) {
  return {
    assigneeId: workItem.assigneeId,
    assigneeName: workItem.assigneeName,
    associatedJudge: workItem.associatedJudge,
    associatedJudgeId: workItem.associatedJudgeId,
    caseIsInProgress: workItem.caseIsInProgress,
    completedAt: workItem.completedAt,
    completedBy: workItem.completedBy,
    completedByUserId: workItem.completedByUserId,
    completedMessage: workItem.completedMessage,
    createdAt: workItem.createdAt,
    docketEntry: JSON.stringify(workItem.docketEntry),
    docketNumber: workItem.docketNumber,
    hideFromPendingMessages: workItem.hideFromPendingMessages,
    highPriority: workItem.highPriority,
    inProgress: workItem.inProgress,
    isInitializeCase: workItem.isInitializeCase,
    isRead: workItem.isRead,
    section: workItem.section,
    sentBy: workItem.sentBy,
    sentBySection: workItem.sentBySection,
    sentByUserId: workItem.sentByUserId,
    updatedAt: workItem.updatedAt,
    workItemId: workItem.workItemId,
  };
}

function getWorkItemSection({
  section,
  documentTitle,
}: {
  section: string;
  documentTitle: string;
}) {
  // We have sections for caseServicesSupervisor and clerkofcourt, but as far as we can tell, they aren't used.
  // Instead, we need to translate these into either the petitions section or the docket section depending
  // on the document type.
  if (!['caseServicesSupervisor', 'clerkofcourt'].includes(section)) {
    return section;
  }
  if (documentTitle.toLocaleLowerCase() == 'petition') {
    return 'petitions';
  }
  return 'docket';
}

export function toKyselyNewWorkItem(workItem: RawWorkItem): NewWorkItemKysely {
  return {
    ...pickFields(workItem),
    section: getWorkItemSection({
      section: workItem.section,
      documentTitle: workItem.docketEntry.documentTitle,
    }),
  };
}

export function workItemEntity(workItem) {
  return new WorkItem({
    ...transformNullToUndefined({
      ...workItem,
      caseStatus: workItem.status,
      caseTitle: Case.getCaseTitle(workItem.caption || ''),
      completedAt: workItem.completedAt?.toISOString(),
      createdAt: workItem.createdAt?.toISOString(),
      trialDate: workItem.trialDate?.toISOString(),
      updatedAt: workItem.createdAt?.toISOString(),
    }),
    assigneeId: workItem.assigneeId, // this needs to be null because it replicates what was done in dynamo
  });
}
