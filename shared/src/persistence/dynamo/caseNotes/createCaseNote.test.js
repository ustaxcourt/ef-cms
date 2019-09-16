const sinon = require('sinon');
const { createCaseNote } = require('./createCaseNote');

describe('createCaseNote', () => {
  let applicationContext;
  let putStub;

  const caseNote = {
    caseId: '123',
    notes: 'something',
    userId: '456',
  };

  beforeEach(() => {
    putStub = sinon.stub().returns({
      promise: async () => null,
    });

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        put: putStub,
      }),
    };
  });

  it('attempts to persist the case note', async () => {
    await createCaseNote({
      applicationContext,
      caseNote,
    });
    expect(putStub.getCall(0).args[0]).toMatchObject({
      Item: {
        pk: 'case-note|123',
        sk: '456',
        ...caseNote,
      },
      TableName: 'efcms-dev',
    });
  });
});
