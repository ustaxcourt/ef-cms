import { PETITIONS_SECTION } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getMessagesByDocketNumber } from './getMessagesByDocketNumber';

const mockMessage = {
  createdAt: '2019-03-01T21:40:46.415Z',
  docketNumber: '123-20',
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

describe('getMessagesByDocketNumber', () => {
  beforeAll(() => {
    applicationContext.environment.stage = 'dev';
    applicationContext
      .getDocumentClient()
      .query.mockResolvedValueOnce({ Items: [mockMessage] });
  });

  it('retrieves the message from persistence', async () => {
    const retrievedMessage = await getMessagesByDocketNumber({
      applicationContext,
      docketNumber: mockMessage.docketNumber,
    });

    expect(retrievedMessage).toEqual([mockMessage]);
  });
});
