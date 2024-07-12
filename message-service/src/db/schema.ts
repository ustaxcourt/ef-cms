import {
  boolean,
  jsonb,
  pgSchema,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const schema = pgSchema('dawson');

export const messagesTable = schema.table('messages', {
  attachments: jsonb('attachments').default([]),
  caseStatus: text('caseStatus'), // requires a join with the case
  caseTitle: text('caseTitle'), // requires join with case
  createdAt: timestamp('createdAt'),
  docketNumber: text('docketNumber'),
  docketNumberWithSuffix: text('docketNumberWithSuffix'), // probably should live in case since this is computed by proceedure type
  entityName: text('entityName'), // not needed in sql imo
  from: text('from'), // join on user table to get their name
  fromSection: text('fromSection'), // the section technically
  fromUserId: uuid('fromUserId'),
  id: serial('id').primaryKey(),
  isCompleted: boolean('isCompleted').default(false),
  isRead: boolean('isRead').default(false),
  isRepliedTo: boolean('isRepliedTo').default(false),
  message: text('message'),
  messageId: uuid('messageId'),
  parentMessageId: uuid('parentMessageId'),
  subject: text('subject'),
  to: text('to'), // join with user to get their name
  toSection: text('toSection'),
  toUserId: uuid('toUserId'),
});

// {
//     "isRepliedTo": false,
//     "attachments": [],
//     "caseStatus": "General Docket - Not at Issue",
//     "fromUserId": "3805d1ab-18d0-43ec-bafb-654e83405416",
//     "subject": "message to myself",
//     "toSection": "petitions",
//     "gsi1pk": "message|eb0a139a-8951-4de1-8b83-f02a27504105",
//     "caseTitle": "Bill Burr",
//     "isRead": false,
//     "messageId": "eb0a139a-8951-4de1-8b83-f02a27504105",
//     "message": "hello!",
//     "toUserId": "3805d1ab-18d0-43ec-bafb-654e83405416",
//     "createdAt": "2020-06-05T18:02:25.280Z",
//     "entityName": "Message",
//     "sk": "message|eb0a139a-8951-4de1-8b83-f02a27504105",
//     "parentMessageId": "eb0a139a-8951-4de1-8b83-f02a27504105",
//     "docketNumberWithSuffix": "105-20L",
//     "from": "Test Petitionsclerk",
//     "pk": "case|105-20",
//     "to": "Test Petitionsclerk",
//     "fromSection": "petitions",
//     "docketNumber": "105-20",
//     "isCompleted": false
//   },
