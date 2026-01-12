import { CaseKysely } from '@web-api/persistence/postgres/cases/schema';
import { NullablePick } from '@web-api/persistence/postgres/utils/typeHelpers';
import { Selectable, Insertable, ColumnType } from 'kysely';

const DEFAULT = {};

export const messageTableDefinition = {
  attachments: DEFAULT as
    | ColumnType<{ documentId: string }[], string, string>
    | undefined,
  completedAt: DEFAULT as Date | null,
  completedBy: DEFAULT as string | null,
  completedBySection: DEFAULT as string | null,
  completedByUserId: DEFAULT as string | null,
  completedMessage: DEFAULT as string | null,
  createdAt: DEFAULT as Date,
  docketNumber: DEFAULT as string,
  from: DEFAULT as string,
  fromSection: DEFAULT as string,
  fromUserId: DEFAULT as string,
  isCompleted: DEFAULT as boolean,
  isRead: DEFAULT as boolean,
  isRepliedTo: DEFAULT as boolean,
  message: DEFAULT as string,
  messageId: DEFAULT as string,
  parentMessageId: DEFAULT as string,
  subject: DEFAULT as string,
  to: DEFAULT as string,
  toSection: DEFAULT as string,
  toUserId: DEFAULT as string,
};

export type MessageTable = typeof messageTableDefinition;

export const DW_MESSAGE_COLUMNS = Object.keys(messageTableDefinition) as Array<
  keyof MessageTable
>;

export type MessageKysely = Selectable<MessageTable>;
export type NewMessageKysely = Insertable<MessageTable>;

export type MessageWithAssociatedCaseDataKysely = MessageKysely &
  NullablePick<
    CaseKysely,
    'status' | 'trialDate' | 'completedAt' | 'createdAt' | 'caption'
  >;
