import { Case } from '@shared/business/entities/cases/Case';
import { RawWorkItem, WorkItem } from '@shared/business/entities/WorkItem';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import {
  NewWorkItemKysely,
  WorkItemKysely,
  RawWorkItemWithCaseInfo,
  WorkItemWithCaseInfoKysely,
} from '@web-api/persistence/postgres/workitems/schema';

export function toKyselyNewWorkItem(workItem: RawWorkItem): NewWorkItemKysely {
  return {
    assigneeId: workItem.assigneeId,
    assigneeName: workItem.assigneeName,
    completedAt: workItem.completedAt
      ? calculateDate({ dateString: workItem.completedAt })
      : null,
    completedBy: workItem.completedBy,
    completedByUserId: workItem.completedByUserId,
    completedMessage: workItem.completedMessage,
    createdAt: calculateDate({ dateString: workItem.createdAt }),
    docketEntryId: workItem.docketEntryId,
    docketNumber: workItem.docketNumber,
    inProgress: workItem.inProgress,
    isRead: workItem.isRead,
    section: workItem.section,
    sentBy: workItem.sentBy,
    sentBySection: workItem.sentBySection,
    sentByUserId: workItem.sentByUserId,
    updatedAt: calculateDate({ dateString: workItem.updatedAt }),
    workItemId: workItem.workItemId,
  };
}

export function fromKyselyWorkItem(workItem: WorkItemKysely) {
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

// Sometimes we need to augment WorkItem data with data from the associated case
export function fromKyselyWorkItemAndCase(
  dbWorkItem: WorkItemWithCaseInfoKysely,
): RawWorkItemWithCaseInfo {
  const workItemWithCaseInfo: RawWorkItemWithCaseInfo = {
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
  };
  return transformNullToUndefined(workItemWithCaseInfo);
}
