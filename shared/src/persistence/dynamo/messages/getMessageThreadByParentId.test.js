const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  PETITIONS_SECTION,
} = require('../../../business/entities/EntityConstants');
const { getMessageThreadByParentId } = require('./getMessageThreadByParentId');

const mockMessage = {
  createdAt: '2019-03-01T21:40:46.415Z',
  docketNumber: '101-20',
  from: 'Test Petitionsclerk',
  fromSection: PETITIONS_SECTION,
  fromUserId: '4791e892-14ee-4ab1-8468-0c942ec379d2',
  message: 'hey there',
  messageId: 'a10d6855-f3ee-4c11-861c-c7f11cba4dff',
  subject: 'hello',
  to: 'Test Petitionsclerk2',
  toSection: PETITIONS_SECTION,
  toUserId: '449b916e-3362-4a5d-bf56-b2b94ba29c12',
};

describe('getMessageThreadByParentId', () => {
  beforeAll(() => {
    applicationContext.environment.stage = 'dev';
    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: () => Promise.resolve({ Items: [mockMessage] }),
    });
  });

  it('retrieves the message from persistence', async () => {
    const retrievedMessage = await getMessageThreadByParentId({
      applicationContext,
      messageId: mockMessage.messageId,
    });

    expect(retrievedMessage).toEqual([mockMessage]);
  });
});
