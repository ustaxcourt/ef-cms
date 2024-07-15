import {
  boolean,
  jsonb,
  pgSchema,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const schema = pgSchema('dawson');

export const messagesTable = schema.table('messages', {
  attachments: jsonb('attachments').default([]),
  caseStatus: text('caseStatus'),
  caseTitle: text('caseTitle'),
  completedAt: timestamp('completedAt'),
  completedBySection: text('completedBySection'),
  completedByUserId: uuid('completedByUserId'),
  createdAt: timestamp('createdAt'),
  docketNumber: text('docketNumber'),
  docketNumberWithSuffix: text('docketNumberWithSuffix'),
  entityName: text('entityName'),
  from: text('from'),
  fromSection: text('fromSection'),
  fromUserId: uuid('fromUserId'),
  isCompleted: boolean('isCompleted').default(false),
  isRead: boolean('isRead').default(false),
  isRepliedTo: boolean('isRepliedTo').default(false),
  message: text('message'),
  messageId: uuid('messageId').primaryKey(),
  parentMessageId: uuid('parentMessageId'),
  subject: text('subject'),
  to: text('to'),
  toSection: text('toSection'),
  toUserId: uuid('toUserId'),
});
