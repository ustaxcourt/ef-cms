import { RawWorkItem, WorkItem } from '@shared/business/entities/WorkItem';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import { WorkItemWithCaseInfo } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';
import { Case } from '@shared/business/entities/cases/Case';
import { Insertable, Selectable, Updateable } from 'kysely';

const DEFAULT = {};

const workItemTableDefinition = {
  assigneeId: DEFAULT as string | undefined,
  assigneeName: DEFAULT as string | undefined,
  caseIsInProgress: DEFAULT as boolean | undefined,
  completedAt: DEFAULT as Date | undefined,
  completedBy: DEFAULT as string | undefined,
  completedByUserId: DEFAULT as string | undefined,
  completedMessage: DEFAULT as string | undefined,
  createdAt: DEFAULT as Date,
  docketEntry: DEFAULT as any,
  docketNumber: DEFAULT as string,
  inProgress: DEFAULT as boolean | undefined,
  isRead: DEFAULT as boolean | undefined,
  section: DEFAULT as string,
  sentBy: DEFAULT as string,
  sentBySection: DEFAULT as string | undefined,
  sentByUserId: DEFAULT as string | undefined,
  updatedAt: DEFAULT as Date,
  workItemId: DEFAULT as string,
};

export type WorkItemTable = typeof workItemTableDefinition;

export const DW_WORK_ITEM_COLUMNS = Object.keys(
  workItemTableDefinition,
) as Array<keyof WorkItemTable>;

export type WorkItemKysely = Selectable<WorkItemTable>;
export type NewWorkItemKysely = Insertable<WorkItemTable>;
export type UpdateWorkItemKysely = Updateable<WorkItemTable>;

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
  };
  return transformNullToUndefined(workItemWithCaseInfo);
}
