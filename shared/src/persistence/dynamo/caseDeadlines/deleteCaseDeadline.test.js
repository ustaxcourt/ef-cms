const sinon = require('sinon');
const { deleteCaseDeadline } = require('./deleteCaseDeadline');

describe('deleteCaseDeadline', () => {
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

  it('attempts to persist the trial session', async () => {
    await deleteCaseDeadline({
      applicationContext,
      caseDeadlineId: '123',
      caseId: '456',
    });

    expect(deleteStub.getCall(0).args[0]).toMatchObject({
      Key: {
        pk: 'case-deadline-123',
        sk: 'case-deadline-123',
      },
      TableName: 'efcms-dev',
    });

    expect(deleteStub.getCall(1).args[0]).toMatchObject({
      Key: {
        pk: '456|case-deadline',
        sk: 'case-deadline-123',
      },
      TableName: 'efcms-dev',
    });

    expect(deleteStub.getCall(2).args[0]).toMatchObject({
      Key: {
        pk: 'case-deadline-catalog',
        sk: 'case-deadline-123',
      },
      TableName: 'efcms-dev',
    });
  });
});
