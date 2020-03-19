const { deleteCaseDeadline } = require('./deleteCaseDeadline');

describe('deleteCaseDeadline', () => {
  let applicationContext;
  let deleteStub;

  beforeEach(() => {
    deleteStub = jest.fn().mockReturnValue({
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

  it('deletes the case deadline', async () => {
    await deleteCaseDeadline({
      applicationContext,
      caseDeadlineId: '123',
      caseId: '456',
    });

    expect(deleteStub.mock.calls[0][0]).toMatchObject({
      Key: {
        pk: 'case-deadline|123',
        sk: 'case-deadline|123',
      },
      TableName: 'efcms-dev',
    });

    expect(deleteStub.mock.calls[1][0]).toMatchObject({
      Key: {
        pk: 'case|456',
        sk: 'case-deadline|123',
      },
      TableName: 'efcms-dev',
    });

    expect(deleteStub.mock.calls[2][0]).toMatchObject({
      Key: {
        pk: 'case-deadline-catalog',
        sk: 'case-deadline|123',
      },
      TableName: 'efcms-dev',
    });
  });
});
