const sinon = require('sinon');
const { updateCaseNote } = require('./updateCaseNote');

describe('updateCaseNote', () => {
  let putStub;
  beforeEach(() => {
    putStub = sinon.stub().returns({
      promise: async () => null,
    });
  });

  it('invokes the peristence layer with pk of case-note|{caseId}, sk of {userId} and other expected params', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        put: putStub,
      }),
    };
    await updateCaseNote({
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
        pk: 'case-note|456',
        sk: '123',
      },
      applicationContext: { environment: { stage: 'dev' } },
    });
  });
});
