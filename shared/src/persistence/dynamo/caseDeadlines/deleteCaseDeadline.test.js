const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { deleteCaseDeadline } = require('./deleteCaseDeadline');

describe('deleteCaseDeadline', () => {
  const CASE_ID = 'e52f385f-6331-493c-9413-47d105b1cf78';

  beforeAll(() => {
    applicationContext.environment.stage = 'dev';

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

  it('deletes the case deadline', async () => {
    await deleteCaseDeadline({
      applicationContext,
      caseDeadlineId: '123',
      docketNubmer: '456-20',
    });

    expect(
      applicationContext.getDocumentClient().delete.mock.calls[0][0],
    ).toMatchObject({
      Key: {
        pk: 'case-deadline|123',
        sk: 'case-deadline|123',
      },
      TableName: 'efcms-dev',
    });
    expect(
      applicationContext.getDocumentClient().delete.mock.calls[1][0],
    ).toMatchObject({
      Key: {
        pk: `case|${CASE_ID}`,
        sk: 'case-deadline|123',
      },
      TableName: 'efcms-dev',
    });
    expect(
      applicationContext.getDocumentClient().delete.mock.calls[2][0],
    ).toMatchObject({
      Key: {
        pk: 'case-deadline-catalog',
        sk: 'case-deadline|123',
      },
      TableName: 'efcms-dev',
    });
  });
});
