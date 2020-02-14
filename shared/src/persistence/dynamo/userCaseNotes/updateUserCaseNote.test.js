const sinon = require('sinon');
const { updateUserCaseNote } = require('./updateUserCaseNote');

describe('updateUserCaseNote', () => {
  let putStub;
  beforeEach(() => {
    putStub = sinon.stub().returns({
      promise: async () => null,
    });
  });

  it('invokes the persistence layer with pk of user-case-note|{caseId}, sk of {userId} and other expected params', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        put: putStub,
      }),
    };
    await updateUserCaseNote({
      applicationContext,
      caseNoteToUpdate: {
        caseId: '456',
        notes: 'something!!!',
        userId: '123',
      },
    });
    expect(putStub.getCall(0).args[0]).toMatchObject({
      Item: {
        notes: 'something!!!',
        pk: 'user-case-note|456',
        sk: '123',
      },
      applicationContext: { environment: { stage: 'dev' } },
    });
  });
});
