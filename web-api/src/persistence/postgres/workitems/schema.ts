import { CaseKysely } from '@web-api/persistence/postgres/cases/schema';
import { DocketEntryKysely } from '@web-api/persistence/postgres/docketEntries/schema';
import { Selectable, Insertable, Nullable } from 'kysely';

const DEFAULT = {};

const workItemTableDefinition = {
  assigneeId: DEFAULT as string | null,
  assigneeName: DEFAULT as string | null,
  completedAt: DEFAULT as Date | null,
  completedBy: DEFAULT as string | null,
  completedByUserId: DEFAULT as string | null,
  completedMessage: DEFAULT as string | null,
  createdAt: DEFAULT as Date,
  docketEntryId: DEFAULT as string,
  docketNumber: DEFAULT as string,
  inProgress: DEFAULT as boolean | null,
  isRead: DEFAULT as boolean | null,
  section: DEFAULT as string,
  sentBy: DEFAULT as string,
  sentBySection: DEFAULT as string | null,
  sentByUserId: DEFAULT as string | null,
  updatedAt: DEFAULT as Date,
  workItemId: DEFAULT as string,
};

export type WorkItemTable = typeof workItemTableDefinition;

export const DW_WORK_ITEM_COLUMNS = Object.keys(
  workItemTableDefinition,
) as Array<keyof WorkItemTable>;

export type WorkItemWithAssociatedCaseDataKysely = WorkItemKysely &
  Nullable<
    Pick<
      CaseKysely,
      'status' | 'trialDate' | 'trialLocation' | 'leadDocketNumber' | 'caption'
    >
  > & { docketEntry: Nullable<DocketEntryKysely> | null };

export type WorkItemKysely = Selectable<WorkItemTable>;
export type NewWorkItemKysely = Insertable<WorkItemTable>;
