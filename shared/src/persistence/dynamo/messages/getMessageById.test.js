const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getMessageById } = require('./getMessageById');

describe('getMessageById', () => {
  const mockDocketNumber = '101-20';
  const mockMessageId = '445e9644-1f8f-4778-9582-6eafc15f1de4';

  const mockMessage = {
    docketNumber: mockDocketNumber,
    messageId: mockMessageId,
  };

  beforeAll(() => {
    applicationContext.getDocumentClient().get.mockReturnValue({
      promise: async () => Promise.resolve({ Item: mockMessage }),
    });
  });

  it('should make a call to persistence with pk of case|{docketNumber} and sk of message|{messageId}', async () => {
    await getMessageById({
      applicationContext,
      docketNumber: mockDocketNumber,
      messageId: mockMessageId,
    });

    expect(
      applicationContext.getDocumentClient().get.mock.calls[0][0],
    ).toMatchObject({
      Key: {
        pk: `case|${mockDocketNumber}`,
        sk: `message|${mockMessageId}`,
      },
    });
  });

  it('should return the message retrieved from persistence', async () => {
    const returnedMessage = await getMessageById({
      applicationContext,
      docketNumber: mockDocketNumber,
      messageId: mockMessageId,
    });

    expect(returnedMessage).toEqual(mockMessage);
  });
});
