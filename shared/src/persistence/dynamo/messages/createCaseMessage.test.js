const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { createCaseMessage } = require('./createCaseMessage');

const CASE_ID = '5c1bbac9-4474-4ba3-ab5b-1a0a92d58dd8';
const mockCaseMessage = {
  createdAt: '2019-03-01T21:40:46.415Z',
  docketNumber: '123-20',
  from: 'Test Petitionsclerk',
  fromSection: 'petitions',
  fromUserId: '4791e892-14ee-4ab1-8468-0c942ec379d2',
  message: 'hey there',
  messageId: 'a10d6855-f3ee-4c11-861c-c7f11cba4dff',
  parentMessageId: '31687a1e-3640-42cd-8e7e-a8e6df39ce9a',
  subject: 'hello',
  to: 'Test Petitionsclerk2',
  toSection: 'petitions',
  toUserId: '449b916e-3362-4a5d-bf56-b2b94ba29c12',
};

describe('createCaseMessage', () => {
  beforeAll(() => {
    applicationContext.environment.stage = 'dev';
    applicationContext.getDocumentClient().put.mockReturnValue({
      promise: () => Promise.resolve(null),
    });

    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: () =>
        Promise.resolve({
          Items: [
            {
              pk: `case|${CASE_ID}`,
              sk: `case|${CASE_ID}`,
            },
          ],
        }),
    });
  });

  it('attempts to persist the case message record', async () => {
    await createCaseMessage({
      applicationContext,
      caseMessage: mockCaseMessage,
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0].Item,
    ).toMatchObject({
      gsi1pk: `message|${mockCaseMessage.parentMessageId}`,
      pk: `case|${CASE_ID}`,
      sk: `message|${mockCaseMessage.messageId}`,
      ...mockCaseMessage,
    });
  });
});
