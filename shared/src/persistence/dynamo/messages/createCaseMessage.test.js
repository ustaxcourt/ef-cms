const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { createCaseMessage } = require('./createCaseMessage');

const mockCaseMessage = {
  caseId: 'b3f09a45-b27c-4383-acc1-2ab1f99e6725',
  createdAt: '2019-03-01T21:40:46.415Z',
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

describe('createCaseMessage', () => {
  beforeAll(() => {
    applicationContext.environment.stage = 'dev';
    applicationContext.getDocumentClient().put.mockReturnValue({
      promise: () => Promise.resolve(null),
    });
  });

  it('attempts to persist the case message records', async () => {
    await createCaseMessage({
      applicationContext,
      caseMessage: mockCaseMessage,
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls.length,
    ).toEqual(6);
    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0].Item,
    ).toMatchObject({
      pk: `case|${mockCaseMessage.caseId}`,
      sk: `message|${mockCaseMessage.messageId}`,
      ...mockCaseMessage,
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[1][0].Item,
    ).toMatchObject({
      pk: `message|${mockCaseMessage.messageId}`,
      sk: `message|${mockCaseMessage.messageId}`,
      ...mockCaseMessage,
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[2][0].Item,
    ).toMatchObject({
      gsi1pk: `message|${mockCaseMessage.messageId}`,
      pk: `user-inbox|${mockCaseMessage.toUserId}`,
      sk: `message|${mockCaseMessage.messageId}`,
      ...mockCaseMessage,
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[3][0].Item,
    ).toMatchObject({
      gsi1pk: `message|${mockCaseMessage.messageId}`,
      pk: `user-outbox|${mockCaseMessage.fromUserId}`,
      sk: mockCaseMessage.createdAt,
      ...mockCaseMessage,
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[4][0].Item,
    ).toMatchObject({
      gsi1pk: `message|${mockCaseMessage.messageId}`,
      pk: `section-inbox|${mockCaseMessage.toSection}`,
      sk: `message|${mockCaseMessage.messageId}`,
      ...mockCaseMessage,
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[5][0].Item,
    ).toMatchObject({
      gsi1pk: `message|${mockCaseMessage.messageId}`,
      pk: `section-outbox|${mockCaseMessage.fromSection}`,
      sk: mockCaseMessage.createdAt,
      ...mockCaseMessage,
    });
  });
});
