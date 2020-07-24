const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  markCaseMessageThreadRepliedTo,
} = require('./markCaseMessageThreadRepliedTo');

describe('markCaseMessageThreadRepliedTo', () => {
  const CASE_ID = '33f568de-b62d-4fd0-adfd-f9866b98016f';

  beforeAll(() => {
    applicationContext.environment.stage = 'dev';
    applicationContext.getDocumentClient().update.mockReturnValue({
      promise: () => Promise.resolve(null),
    });
    applicationContext
      .getDocumentClient()
      .query.mockReturnValueOnce({
        promise: () =>
          Promise.resolve({
            Items: [
              {
                gsi1pk: 'message|28de1ba1-8518-4a7d-8075-4291eea569c7',
                messageId: '28de1ba1-8518-4a7d-8075-4291eea569c7',
                pk: `case|${CASE_ID}`,
                sk: 'message|28de1ba1-8518-4a7d-8075-4291eea569c7',
              },
              {
                gsi1pk: 'message|28de1ba1-8518-4a7d-8075-4291eea569c7',
                messageId: 'badc2bf0-cc82-4fd1-9a61-d1a8937a4f1b',
                pk: `case|${CASE_ID}`,
                sk: 'message|badc2bf0-cc82-4fd1-9a61-d1a8937a4f1b',
              },
            ],
          }),
      })
      .mockReturnValueOnce({
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

  it('attempts to update the case message records', async () => {
    await markCaseMessageThreadRepliedTo({
      applicationContext,
      caseId: 'bd775c3b-96ce-4cf0-ae9c-fda225266434',
      messageId: '0c0de040-1dfd-4be8-937a-d6aefdfcd71d',
    });

    expect(
      applicationContext.getDocumentClient().update.mock.calls.length,
    ).toEqual(2);
    expect(
      applicationContext.getDocumentClient().update.mock.calls[0][0],
    ).toMatchObject({
      Key: {
        pk: `case|${CASE_ID}`,
        sk: 'message|28de1ba1-8518-4a7d-8075-4291eea569c7',
      },
    });
    expect(
      applicationContext.getDocumentClient().update.mock.calls[1][0],
    ).toMatchObject({
      Key: {
        pk: `case|${CASE_ID}`,
        sk: 'message|badc2bf0-cc82-4fd1-9a61-d1a8937a4f1b',
      },
    });
  });
});
