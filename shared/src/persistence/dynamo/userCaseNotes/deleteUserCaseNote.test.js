const sinon = require('sinon');
const { deleteUserCaseNote } = require('./deleteUserCaseNote');

describe('deleteUserCaseNote', () => {
  let applicationContext;
  let deleteStub;

  beforeEach(() => {
    deleteStub = sinon.stub().returns({
      promise: async () => null,
    });

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        delete: deleteStub,
      }),
    };
  });

  it('attempts to delete the case note', async () => {
    await deleteUserCaseNote({
      applicationContext,
      caseId: '456',
      userId: '123',
    });

    expect(deleteStub.getCall(0).args[0]).toMatchObject({
      Key: {
        pk: 'user-case-note|456',
        sk: '123',
      },
      TableName: 'efcms-dev',
    });
  });
});
