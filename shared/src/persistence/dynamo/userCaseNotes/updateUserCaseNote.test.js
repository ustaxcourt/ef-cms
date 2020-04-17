const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { updateUserCaseNote } = require('./updateUserCaseNote');

describe('updateUserCaseNote', () => {
  let putStub;
  beforeEach(() => {
    putStub = jest.fn().mockReturnValue({
      promise: async () => null,
    });
  });

  it('invokes the persistence layer with pk of user-case-note|{caseId}, sk of {userId} and other expected params', async () => {
    applicationContext.getDocumentClient.mockReturnValue({
      put: putStub,
    });
    await updateUserCaseNote({
      applicationContext,
      caseNoteToUpdate: {
        caseId: '456',
        notes: 'something!!!',
        userId: '123',
      },
    });
    expect(putStub.mock.calls[0][0]).toMatchObject({
      Item: {
        notes: 'something!!!',
        pk: 'user-case-note|456',
        sk: 'user|123',
      },
      applicationContext: { environment: { stage: 'local' } },
    });
  });
});
