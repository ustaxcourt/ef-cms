import { ColumnType, Insertable, Selectable, Updateable } from 'kysely';

export interface Database {
  dwMessage: MessageTable;
  dwCase: CaseTable;
  dwCaseCorrespondence: CaseCorrespondenceTable;
  dwCaseDeadline: CaseDeadlineTable;
}

export interface MessageTable {
  attachments?: ColumnType<{ documentId: string }[], string, string>;
  completedAt?: Date;
  completedBy?: string;
  completedBySection?: string;
  completedByUserId?: string;
  completedMessage?: string;
  createdAt: Date;
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
  trialDate?: Date;
  trialLocation?: string;
}

export type CaseKysely = Selectable<CaseTable>;
export type NewCaseKysely = Insertable<CaseTable>;
export type UpdateCaseKysely = Updateable<CaseTable>;

export interface CaseCorrespondenceTable {
  archived?: boolean;
  correspondenceId: string;
  documentTitle: string;
  filedBy?: string;
  filingDate: string;
  userId: string;
}

export type CaseCorrespondenceKysely = Selectable<CaseCorrespondenceTable>;
export type NewCaseCorrespondenceKysely = Insertable<CaseCorrespondenceTable>;
export type UpdateCaseCorrespondenceKysely =
  Updateable<CaseCorrespondenceTable>;

export interface CaseDeadlineTable {
  associatedJudge: string;
  associatedJudgeId: string;
  caseDeadlineId: string;
  createdAt: string;
  deadlineDate: string;
  description: string;
  docketNumber: string;
  sortableDocketNumber: number;
}

export type CaseDeadlineKysely = Selectable<CaseDeadlineTable>;
export type NewCaseDeadlineKysely = Insertable<CaseDeadlineTable>;
export type UpdateCaseDeadlineKysely = Updateable<CaseDeadlineTable>;
