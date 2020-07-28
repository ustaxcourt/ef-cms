const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { updateUserCaseNote } = require('./updateUserCaseNote');
jest.mock('../cases/getCaseIdFromDocketNumber');
const {
  getCaseIdFromDocketNumber,
} = require('../cases/getCaseIdFromDocketNumber');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('updateUserCaseNote', () => {
  beforeEach(() => {
    getCaseIdFromDocketNumber.mockReturnValue(MOCK_CASE.caseId);
  });

  it('invokes the persistence layer with pk of user-case-note|{caseId}, sk of {userId} and other expected params', async () => {
    await updateUserCaseNote({
      applicationContext,
      caseNoteToUpdate: {
        docketNumber: '123-45',
        notes: 'something!!!',
        userId: '123',
      },
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        notes: 'something!!!',
        pk: `user-case-note|${MOCK_CASE.caseId}`,
        sk: 'user|123',
      },
    });
  });
});
