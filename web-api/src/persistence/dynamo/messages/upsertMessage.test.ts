import {
  DOCKET_SECTION,
  PETITIONS_SECTION,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { RawMessage } from '@shared/business/entities/Message';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { put } from '../../dynamodbClientService';
import { upsertMessage } from './upsertMessage';

jest.mock('../../dynamodbClientService', () => ({
  put: jest.fn(),
}));

const mockMessage = {
  createdAt: '2019-03-01T21:40:46.415Z',
  docketNumber: '123-20',
  from: 'Test Petitionsclerk',
  fromSection: PETITIONS_SECTION,
  fromUserId: '4791e892-14ee-4ab1-8468-0c942ec379d2',
  message: 'hey there',
  messageId: 'a10d6855-f3ee-4c11-861c-c7f11cba4dff',
  parentMessageId: '31687a1e-3640-42cd-8e7e-a8e6df39ce9a',
  subject: 'hello',
  to: 'Test Docketclerk',
  toSection: DOCKET_SECTION,
  toUserId: '449b916e-3362-4a5d-bf56-b2b94ba29c12',
} as RawMessage;

describe('upsertMessage', () => {
  it('persists the message record', async () => {
    await upsertMessage({
      applicationContext,
      message: mockMessage,
    });

    expect((put as jest.Mock).mock.calls[2][0].Item).toMatchObject({
      gsi1pk: `message|${mockMessage.parentMessageId}`,
      gsiSectionBox: `section|${mockMessage.toSection}`,
      gsiUserBox: `assigneeId|${mockMessage.toUserId}`,
      pk: 'case|123-20',
      sk: `message|${mockMessage.messageId}`,
      ...mockMessage,
    });

    expect(put as jest.Mock).toHaveBeenCalledTimes(3);
  });

  describe('message is completed', () => {
    const completedMessage = {
      ...mockMessage,
      completedAt: '2019-03-01T21:40:46.415Z',
      completedBy: 'Someone',
      completedBySection: 'completed-by-section',
      completedByUserId: 'completed-by-user-id',
      completedMessage: 'you complete me',
      isCompleted: true,
    };

    it('puts the message in the completed of the user who completed it', async () => {
      await upsertMessage({
        applicationContext,
        message: completedMessage,
      });
      expect((put as jest.Mock).mock.calls[0][0].Item).toMatchObject({
        ...mockMessage,
        pk: 'message|completed|user|completed-by-user-id',
        sk: completedMessage.completedAt,
        ttl: expect.anything(),
      });
    });

    it('puts the message in the completed of the section that completed it', async () => {
      await upsertMessage({
        applicationContext,
        message: completedMessage,
      });
      expect((put as jest.Mock).mock.calls[1][0].Item).toMatchObject({
        ...mockMessage,
        pk: 'message|completed|section|completed-by-section',
        sk: completedMessage.completedAt,
        ttl: expect.anything(),
      });
    });
  });

  describe('message is not completed', () => {
    it('puts the message in the outbox of the user who sent it', async () => {
      await upsertMessage({
        applicationContext,
        message: mockMessage,
      });
      expect((put as jest.Mock).mock.calls[0][0].Item).toMatchObject({
        ...mockMessage,
        pk: `message|outbox|user|${mockMessage.fromUserId}`,
        sk: mockMessage.createdAt,
        ttl: expect.anything(),
      });
    });
    it('puts the message in the outbox of the section who sent it', async () => {
      await upsertMessage({
        applicationContext,
        message: mockMessage,
      });
      expect((put as jest.Mock).mock.calls[1][0].Item).toMatchObject({
        ...mockMessage,
        pk: `message|outbox|section|${mockMessage.fromSection}`,
        sk: mockMessage.createdAt,
        ttl: expect.anything(),
      });
    });
  });
});
