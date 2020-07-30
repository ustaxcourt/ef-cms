const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { MOCK_CASE } = require('../../../test/mockCase');
const { updateUserCaseNote } = require('./updateUserCaseNote');

describe('updateUserCaseNote', () => {
  it('invokes the persistence layer with pk of user-case-note|{docketNumber}, sk of {userId} and other expected params', async () => {
    await updateUserCaseNote({
      applicationContext,
      caseNoteToUpdate: {
        docketNumber: MOCK_CASE.docketNumber,
        notes: 'something!!!',
        userId: MOCK_CASE.userId,
      },
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        notes: 'something!!!',
        pk: `user-case-note|${MOCK_CASE.docketNumber}`,
        sk: `user|${MOCK_CASE.userId}`,
      },
    });
  });
});
