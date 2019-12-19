const sinon = require('sinon');
const { deleteJudgesCaseNote } = require('./deleteJudgesCaseNote');

describe('deleteJudgesCaseNote', () => {
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
    await deleteJudgesCaseNote({
      applicationContext,
      caseId: '456',
      userId: '123',
    });

    expect(deleteStub.getCall(0).args[0]).toMatchObject({
      Key: {
        pk: 'judges-case-note|456',
        sk: '123',
      },
      TableName: 'efcms-dev',
    });
  });
});
