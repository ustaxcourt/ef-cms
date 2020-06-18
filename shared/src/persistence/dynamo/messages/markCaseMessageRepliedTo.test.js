const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { markCaseMessageRepliedTo } = require('./markCaseMessageRepliedTo');

describe('markCaseMessageRepliedTo', () => {
  beforeAll(() => {
    applicationContext.environment.stage = 'dev';
    applicationContext.getDocumentClient().update.mockReturnValue({
      promise: () => Promise.resolve(null),
    });
  });

  it('attempts to update the case message record', async () => {
    await markCaseMessageRepliedTo({
      applicationContext,
      caseId: 'bd775c3b-96ce-4cf0-ae9c-fda225266434',
      messageId: '0c0de040-1dfd-4be8-937a-d6aefdfcd71d',
    });

    expect(
      applicationContext.getDocumentClient().update.mock.calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getDocumentClient().update.mock.calls[0][0],
    ).toMatchObject({
      Key: {
        pk: 'case|bd775c3b-96ce-4cf0-ae9c-fda225266434',
        sk: 'message|0c0de040-1dfd-4be8-937a-d6aefdfcd71d',
      },
    });
  });
});
