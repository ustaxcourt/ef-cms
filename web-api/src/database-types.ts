import { ColumnType, Insertable, Selectable, Updateable } from 'kysely';

export interface Database {
  message: MessageTable;
  case: CaseTable;
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

export type Message = Selectable<MessageTable>;
export type NewMessage = Insertable<MessageTable>;
export type UpdateMessage = Updateable<MessageTable>;

export interface CaseTable {
  docketNumber: string;
  trialLocation?: string;
  trialDate?: string;
  leadDocketNumber?: string;
  docketNumberSuffix?: string;
}

export type Case = Selectable<CaseTable>;
export type NewCase = Insertable<CaseTable>;
export type UpdateCase = Updateable<CaseTable>;
