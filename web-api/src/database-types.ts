import { ColumnType, Insertable, Selectable, Updateable } from 'kysely';

export interface Database {
  message: MessageTable;
  case: CaseTable;
  dwUserCaseNote: UserCaseNoteTable;
}

export interface MessageTable {
  attachments?: ColumnType<{ documentId: string }[], string, string>;
  caseStatus: string;
  caseTitle: string;
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
  docketNumber: string;
  trialLocation?: string;
  trialDate?: string;
  leadDocketNumber?: string;
  docketNumberSuffix?: string;
}

export type CaseKysely = Selectable<CaseTable>;
export type NewCaseKysely = Insertable<CaseTable>;
export type UpdateCaseKysely = Updateable<CaseTable>;

export interface UserCaseNoteTable {
  docketNumber: string;
  userId: string;
  notes?: string;
}

export type UserCaseNoteKysely = Selectable<UserCaseNoteTable>;
export type NewUserCaseNoteKysely = Insertable<UserCaseNoteTable>;
export type UpdateUserCaseNoteKysely = Updateable<UserCaseNoteTable>;
