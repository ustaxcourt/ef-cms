const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  getCaseMessagesByDocketNumber,
} = require('./getCaseMessagesByDocketNumber');

const CASE_ID = 'b0b46186-b715-4338-b5c3-c25e06f3fce8';
const mockCaseMessage = {
  createdAt: '2019-03-01T21:40:46.415Z',
  docketNumber: '123-20',
  from: 'Test Petitionsclerk',
  fromSection: 'petitions',
  fromUserId: '4791e892-14ee-4ab1-8468-0c942ec379d2',
  message: 'hey there',
  messageId: 'a10d6855-f3ee-4c11-861c-c7f11cba4dff',
  subject: 'hello',
  to: 'Test Petitionsclerk2',
  toSection: 'petitions',
  toUserId: '449b916e-3362-4a5d-bf56-b2b94ba29c12',
};

describe('getCaseMessagesByDocketNumber', () => {
  beforeAll(() => {
    applicationContext.environment.stage = 'dev';
    applicationContext
      .getDocumentClient()
      .query.mockReturnValueOnce({
        promise: () =>
          Promise.resolve({
            Items: [
              {
                pk: `case|${CASE_ID}`,
                sk: `case|${CASE_ID}`,
              },
            ],
          }),
      })
      .mockReturnValueOnce({
        promise: () => Promise.resolve({ Items: [mockCaseMessage] }),
      });
  });

  it('retrieves the case message from persistence', async () => {
    const retrievedMessage = await getCaseMessagesByDocketNumber({
      applicationContext,
      docketNumber: mockCaseMessage.docketNumber,
    });

    expect(retrievedMessage).toEqual([mockCaseMessage]);
  });
});
