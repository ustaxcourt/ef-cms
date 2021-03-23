const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { deleteUserCaseNote } = require('./deleteUserCaseNote');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('deleteUserCaseNote', () => {
  const USER_ID = '10ecc428-ca35-4e36-aef2-e844660ce22d';

  it('attempts to delete the case note', async () => {
    await deleteUserCaseNote({
      applicationContext,
      docketNumber: MOCK_CASE.docketNumber,
      userId: USER_ID,
    });

    expect(
      applicationContext.getDocumentClient().delete.mock.calls[0][0],
    ).toMatchObject({
      Key: {
        pk: `user-case-note|${MOCK_CASE.docketNumber}`,
        sk: `user|${USER_ID}`,
      },
    });
  });
});
