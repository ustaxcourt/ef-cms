import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { RawMessage } from '@shared/business/entities/Message';

export const MOCK_MESSAGE: RawMessage = {
  attachments: [
    {
      documentId: '8ed9bad9-db58-43c8-b03f-c2e3ad92995f',
    },
  ],
  createdAt: '2020-08-18T18:07:36.333Z',
  docketNumber: '104-19',
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
  caseStatus: CASE_STATUS_TYPES.assignedCase,
  caseTitle: 'boopy doopy',
  docketNumberWithSuffix: '104-19',
};
