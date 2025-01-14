import { ColumnType, Insertable, Selectable, Updateable } from 'kysely';
import { MinuteSheetFormState } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';

export interface Database {
  dwUserCaseNote: UserCaseNoteTable;
  dwMessage: MessageTable;
  dwCase: CaseTable;
  dwMinuteSheet: MinuteSheetTable;
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

export interface UserCaseNoteTable {
  docketNumber: string;
  userId: string;
  notes?: string;
}

export type UserCaseNoteKysely = Selectable<UserCaseNoteTable>;
export type NewUserCaseNoteKysely = Insertable<UserCaseNoteTable>;
export type UpdateUserCaseNoteKysely = Updateable<UserCaseNoteTable>;

export interface MinuteSheetTable {
  trialSessionId: string;
  docketNumber: string;
  content: MinuteSheetFormState; // 10419 TODO probably shouldnt define persistence type here based on client-side form state type?
}

export type MinuteSheetKysely = Selectable<MinuteSheetTable>;
export type NewMinuteSheetKysely = Insertable<MinuteSheetTable>;
export type UpdateMinuteSheetKysely = Updateable<MinuteSheetTable>;
