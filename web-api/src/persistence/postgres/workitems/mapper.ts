import { Case } from '@shared/business/entities/cases/Case';
import { RawWorkItem, WorkItem } from '@shared/business/entities/WorkItem';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import { WorkItemWithCaseInfo } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';
import {
  NewWorkItemKysely,
  WorkItemKysely,
  WorkItemWithAssociatedCaseDataKysely,
} from '@web-api/persistence/postgres/workitems/schema';

function getWorkItemSection({
  section,
  documentTitle,
}: {
  section: string;
  documentTitle?: string;
}) {
  // We have sections for caseServicesSupervisor and clerkofcourt, but as far as we can tell, they aren't used.
  // Instead, we need to translate these into either the petitions section or the docket section depending
  // on the document type.
  if (!['caseServicesSupervisor', 'clerkofcourt'].includes(section)) {
    return section;
  }
  if (documentTitle?.toLocaleLowerCase() == 'petition') {
    return 'petitions';
  }
  return 'docket';
}

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
    docketEntry: JSON.stringify(workItem.docketEntry),
    docketNumber: workItem.docketNumber,
    inProgress: workItem.inProgress,
    isRead: workItem.isRead,
    section: getWorkItemSection({
      section: workItem.section,
      documentTitle: workItem.docketEntry?.documentTitle,
    }),
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
  dbWorkItem: WorkItemWithAssociatedCaseDataKysely,
): WorkItemWithCaseInfo {
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
  };
  return transformNullToUndefined(workItemWithCaseInfo);
}
