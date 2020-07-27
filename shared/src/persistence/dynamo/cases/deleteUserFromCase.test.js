const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { deleteUserFromCase } = require('./deleteUserFromCase');

describe('deleteUserFromCase', () => {
  const CASE_ID = 'd0b45da8-8fa0-4605-ba2a-aff8ec8779b3';

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

  it('attempts to delete the user from the case', async () => {
    await deleteUserFromCase({
      applicationContext,
      docketNumber: '101-20',
      userId: '123',
    });

    expect(
      applicationContext.getDocumentClient().delete.mock.calls[0][0],
    ).toMatchObject({
      Key: {
        pk: 'user|123',
        sk: `case|${CASE_ID}`,
      },
      TableName: 'efcms-dev',
    });
  });
});
