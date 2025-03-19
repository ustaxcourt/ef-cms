import { NewWorkItemKysely } from '@web-api/database-types';
import { RawWorkItem, WorkItem } from '@shared/business/entities/WorkItem';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export const DW_WORK_ITEM_COLUMNS = [
  'assigneeId',
  'assigneeName',
  'completedAt',
  'completedBy',
  'completedByUserId',
  'completedMessage',
  'createdAt',
  'docketEntry',
  'docketNumber',
  'inProgress',
  'isRead',
  'section',
  'sentBy',
  'sentBySection',
  'sentByUserId',
  'updatedAt',
  'workItemId',
];

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
      completedAt: workItem.completedAt?.toISOString(),
      createdAt: workItem.createdAt?.toISOString(),
      updatedAt: workItem.createdAt?.toISOString(),
    }),
    assigneeId: workItem.assigneeId, // this needs to be null because it replicates what was done in dynamo
  });
}
