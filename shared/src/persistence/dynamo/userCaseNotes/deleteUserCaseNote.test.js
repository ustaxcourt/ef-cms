const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { deleteUserCaseNote } = require('./deleteUserCaseNote');
jest.mock('../cases/getCaseIdFromDocketNumber');
const {
  getCaseIdFromDocketNumber,
} = require('../cases/getCaseIdFromDocketNumber');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('deleteUserCaseNote', () => {
  it('attempts to delete the case note', async () => {
    getCaseIdFromDocketNumber.mockReturnValue(MOCK_CASE.caseId);

    await deleteUserCaseNote({
      applicationContext,
      docketNumber: '123-45',
      userId: '123',
    });

    expect(
      applicationContext.getDocumentClient().delete.mock.calls[0][0],
    ).toMatchObject({
      Key: {
        pk: `user-case-note|${MOCK_CASE.caseId}`,
        sk: 'user|123',
      },
    });
  });
});
