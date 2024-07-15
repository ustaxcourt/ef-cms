import { Message } from '../../web-api/src/persistence/repository/Message';
import { getDataSource } from '../data-source';

async function main() {
  const appDataSource = await getDataSource();
  const messageRepository = appDataSource.getRepository(Message);
  const messages = [
    {
      attachments: [],
      caseStatus: 'General Docket - Not at Issue',
      caseTitle: 'Bill Burr',
      createdAt: new Date('2020-06-05T18:02:25.280Z').toISOString(),
      docketNumber: '105-20',
      docketNumberWithSuffix: '105-20L',
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
      to: 'Test Petitionsclerk',
      toSection: 'petitions',
      toUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
    },
    {
      attachments: [
        {
          documentId: '4796a931-14fb-43e6-948f-d2b67ce4c1cb',
        },
      ],
      caseStatus: 'Calendared',
      caseTitle: 'Reuben Blair',
      createdAt: new Date('2023-06-02T21:15:50.105Z').toISOString(),
      docketNumber: '103-20',
      docketNumberWithSuffix: '103-20L',
      from: 'Test Admissions Clerk',
      fromSection: 'admissions',
      fromUserId: '9d7d63b7-d7a5-4905-ba89-ef71bf30057f',
      isCompleted: false,
      isRead: false,
      isRepliedTo: false,
      message: 'Could you please review this?',
      messageId: '1d4c1fd9-5265-4e46-894f-b8426d3a6836',
      parentMessageId: '1d4c1fd9-5265-4e46-894f-b8426d3a6836',
      subject: 'Administrative Record',
      to: 'Test Petitionsclerk',
      toSection: 'petitions',
      toUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
    },
    {
      attachments: [
        {
          documentId: '8ed9bad9-db58-43c8-b03f-c2e3ad92995f',
        },
      ],
      caseStatus: 'New',
      caseTitle: 'Mufutau Wade',
      createdAt: new Date('2020-08-18T18:07:36.333Z').toISOString(),
      docketNumber: '104-19',
      docketNumberWithSuffix: '104-19',
      from: 'Test Docketclerk',
      fromSection: 'docket',
      fromUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      isCompleted: false,
      isRead: false,
      isRepliedTo: false,
      message: 'Test message with deleted document.',
      messageId: '2d1191d3-4597-454a-a2b2-84e267ccf01e',
      parentMessageId: '2d1191d3-4597-454a-a2b2-84e267ccf01e',
      subject: 'Order',
      to: 'Test Docketclerk',
      toSection: 'docket',
      toUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    },
  ];
  await messageRepository.save(messages);
}

main().catch(console.error);
