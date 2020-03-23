const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { deleteUserCaseNote } = require('./deleteUserCaseNote');

describe('deleteUserCaseNote', () => {
  beforeAll(() => {
    applicationContext.environment.stage = 'dev';
  });

  it('attempts to delete the case note', async () => {
    await deleteUserCaseNote({
      applicationContext,
      caseId: '456',
      userId: '123',
    });

    expect(
      applicationContext.getDocumentClient().delete.mock.calls[0][0],
    ).toMatchObject({
      Key: {
        pk: 'user-case-note|456',
        sk: 'user|123',
      },
      TableName: 'efcms-dev',
    });
  });
});
