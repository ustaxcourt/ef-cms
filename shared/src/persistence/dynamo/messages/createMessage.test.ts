import { PETITIONS_SECTION } from '../../../business/entities/EntityConstants';
import { applicationContext } from '../../../business/test/createTestApplicationContext';
import { createMessage } from './createMessage';
import { put } from '../../dynamodbClientService';

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
  to: 'Test Petitionsclerk2',
  toSection: PETITIONS_SECTION,
  toUserId: '449b916e-3362-4a5d-bf56-b2b94ba29c12',
} as TMessageData;

describe('createMessage', () => {
  it('attempts to persist the message record', async () => {
    await createMessage({
      applicationContext,
      message: mockMessage,
    });

    expect((put as jest.Mock).mock.calls.length).toEqual(1);
    expect((put as jest.Mock).mock.calls[0][0].Item).toMatchObject({
      gsi1pk: `message|${mockMessage.parentMessageId}`,
      pk: 'case|123-20',
      sk: `message|${mockMessage.messageId}`,
      ...mockMessage,
    });
  });
});
