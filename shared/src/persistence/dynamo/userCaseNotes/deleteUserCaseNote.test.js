const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { deleteUserCaseNote } = require('./deleteUserCaseNote');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('deleteUserCaseNote', () => {
  it('attempts to delete the case note', async () => {
    await deleteUserCaseNote({
      applicationContext,
      docketNumber: MOCK_CASE.docketNumber,
      userId: MOCK_CASE.userId,
    });

    expect(
      applicationContext.getDocumentClient().delete.mock.calls[0][0],
    ).toMatchObject({
      Key: {
        pk: `user-case-note|${MOCK_CASE.docketNumber}`,
        sk: `user|${MOCK_CASE.userId}`,
      },
    });
  });
});
