const sinon = require('sinon');
const { deleteUserFromCase } = require('./deleteUserFromCase');

describe('deleteUserFromCase', function() {
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

  it('attempts to delete the user from the case', async () => {
    await deleteUserFromCase({
      applicationContext,
      caseId: '456',
      userId: '123',
    });

    expect(deleteStub.getCall(0).args[0]).toMatchObject({
      Key: {
        pk: '123|case',
        sk: '456',
      },
      TableName: 'efcms-dev',
    });
  });
});
