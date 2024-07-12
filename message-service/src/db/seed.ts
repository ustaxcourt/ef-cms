import { client, db } from './index';
import { messagesTable } from './schema';

async function main() {
  await db.insert(messagesTable).values({
    attachments: [],
    caseStatus: 'General Docket - Not at Issue',
    caseTitle: 'Bill Burr',
    createdAt: new Date(),
    docketNumber: '105-20',
    docketNumberWithSuffix: '105-20L',
    entityName: 'Message',
    from: 'Test Petitionsclerk',
    fromSection: 'petitions',
    fromUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
    isCompleted: false,
    isRead: false,
    isRepliedTo: false,
    message: 'hello!',
    messageId: 'eb0a139a-8951-4de1-8b83-f02a27504105',
    parentMessageId: 'eb0a139a-8951-4de1-8b83-f02a27504105',
    subject: 'message to myself',
    to: 'Test Docketclerk',
    toSection: 'docket',
    toUserId: '2805d1ab-18d0-43ec-bafb-654e83405416',
  });

  await client.end();
}

main().catch(console.error);
