import { Selectable, Insertable, Updateable } from 'kysely';

const DEFAULT = {};

const workItemTableDefinition = {
  assigneeId: DEFAULT as string | undefined,
  assigneeName: DEFAULT as string | undefined,
  completedAt: DEFAULT as Date | undefined,
  completedBy: DEFAULT as string | undefined,
  completedByUserId: DEFAULT as string | undefined,
  completedMessage: DEFAULT as string | undefined,
  createdAt: DEFAULT as Date,
  docketEntryId: DEFAULT as string,
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
