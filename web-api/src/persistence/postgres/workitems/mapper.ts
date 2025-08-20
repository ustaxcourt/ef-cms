import { Case } from '@shared/business/entities/cases/Case';
import { RawWorkItem, WorkItem } from '@shared/business/entities/WorkItem';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import { WorkItemWithCaseInfo } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';
import { NewWorkItemKysely } from '@web-api/persistence/postgres/workitems/schema';

function pickFields(workItem) {
  return {
    assigneeId: workItem.assigneeId,
    assigneeName: workItem.assigneeName,
    completedAt: workItem.completedAt,
    completedBy: workItem.completedBy,
    completedByUserId: workItem.completedByUserId,
    completedMessage: workItem.completedMessage,
    createdAt: workItem.createdAt,
    docketEntry: JSON.stringify(workItem.docketEntry),
    docketEntryId: workItem.docketEntryId,
    docketNumber: workItem.docketNumber,
    inProgress: workItem.inProgress,
    isRead: workItem.isRead,
    section: workItem.section,
    sentBy: workItem.sentBy,
    sentBySection: workItem.sentBySection,
    sentByUserId: workItem.sentByUserId,
    updatedAt: workItem.updatedAt,
    workItemId: workItem.workItemId,
  };
}

export function toKyselyNewWorkItem(workItem: RawWorkItem): NewWorkItemKysely {
  return pickFields(workItem);
}

export function workItemEntity(workItem) {
  return new WorkItem({
    ...transformNullToUndefined({
      ...workItem,
      completedAt: workItem.completedAt?.toISOString(),
      createdAt: workItem.createdAt?.toISOString(),
      updatedAt: workItem.createdAt?.toISOString(),
    }),
    assigneeId: workItem.assigneeId, // this needs to be null because it replicates what was done in dynamo
  });
}

export function toWorkItemWithCaseInfo(dbWorkItem): WorkItemWithCaseInfo {
  const workItemWithCaseInfo: WorkItemWithCaseInfo = {
    ...new WorkItem({
      ...dbWorkItem,
      completedAt: dbWorkItem.completedAt?.toISOString(),
      createdAt: dbWorkItem.createdAt?.toISOString(),
      updatedAt: dbWorkItem.createdAt?.toISOString(),
    }).toRawObject(),
    caseTitle: Case.getCaseTitle(dbWorkItem.caption),
    caseStatus: dbWorkItem.status || undefined,
    leadDocketNumber: dbWorkItem?.leadDocketNumber || undefined,
    trialDate: dbWorkItem?.trialDate?.toISOString(),
    trialLocation: dbWorkItem?.trialLocation || undefined,
    docketEntry: dbWorkItem.docketEntry,
  };
  return transformNullToUndefined(workItemWithCaseInfo);
}
