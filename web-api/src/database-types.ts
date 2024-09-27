import { ColumnType, Insertable, Selectable, Updateable } from 'kysely';

export interface Database {
  message: MessageTable;
  case: CaseTable;
  workItem: WorkItemTable;
}

export interface MessageTable {
  attachments?: ColumnType<{ documentId: string }[], string, string>;
  completedAt?: string;
  completedBy?: string;
  completedBySection?: string;
  completedByUserId?: string;
  completedMessage?: string;
  createdAt: string;
  docketNumber: string;
  from: string;
  fromSection: string;
  fromUserId: string;
  isCompleted: boolean;
  isRead: boolean;
  isRepliedTo: boolean;
  leadDocketNumber?: string;
  message: string;
  messageId: string;
  parentMessageId: string;
  subject: string;
  to: string;
  toSection: string;
  toUserId: string;
}

export type MessageKysely = Selectable<MessageTable>;
export type NewMessageKysely = Insertable<MessageTable>;
export type UpdateMessageKysely = Updateable<MessageTable>;

export interface CaseTable {
  caption: string;
  docketNumber: string;
  docketNumberSuffix?: string;
  leadDocketNumber?: string;
  status: string;
  trialDate?: string;
  trialLocation?: string;
}

export type CaseKysely = Selectable<CaseTable>;
export type NewCaseKysely = Insertable<CaseTable>;
export type UpdateCaseKysely = Updateable<CaseTable>;

export interface WorkItemTable {
  assigneeId?: string;
  assigneeName?: string;
  associatedJudge: string;
  associatedJudgeId?: string;
  caseIsInProgress?: boolean;
  completedAt?: string;
  completedBy?: string;
  completedByUserId?: string;
  completedMessage?: string;
  createdAt: string;
  docketEntry: any;
  docketNumber: string;
  hideFromPendingMessages?: boolean;
  highPriority?: boolean;
  inProgress?: boolean;
  isInitializeCase?: boolean;
  isRead?: boolean;
  section: string;
  sentBy: string;
  sentBySection?: string;
  sentByUserId?: string;
  updatedAt: string;
  workItemId: string;
}

export type WorkItemKysely = Selectable<WorkItemTable>;
export type NewWorkItemKysely = Insertable<WorkItemTable>;
export type UpdateWorkItemKysely = Updateable<WorkItemTable>;
