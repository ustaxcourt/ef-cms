import { CaseKysely } from '@web-api/persistence/postgres/cases/schema';
import { NullablePick } from '@web-api/persistence/postgres/utils/typeHelpers';
import { Selectable, Insertable } from 'kysely';

const DEFAULT = {};

const workItemTableDefinition = {
  assigneeId: DEFAULT as string | null,
  assigneeName: DEFAULT as string | null,
  completedAt: DEFAULT as Date | null,
  completedBy: DEFAULT as string | null,
  completedByUserId: DEFAULT as string | null,
  completedMessage: DEFAULT as string | null,
  createdAt: DEFAULT as Date,
  docketEntry: DEFAULT as any,
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
  NullablePick<
    CaseKysely,
    'status' | 'trialDate' | 'trialLocation' | 'leadDocketNumber' | 'caption'
  >;

export type WorkItemKysely = Selectable<WorkItemTable>;
export type NewWorkItemKysely = Insertable<WorkItemTable>;
