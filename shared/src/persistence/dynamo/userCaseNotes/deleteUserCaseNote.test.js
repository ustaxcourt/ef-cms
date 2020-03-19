const { deleteUserCaseNote } = require('./deleteUserCaseNote');

describe('deleteUserCaseNote', () => {
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

  it('attempts to delete the case note', async () => {
    await deleteUserCaseNote({
      applicationContext,
      caseId: '456',
      userId: '123',
    });

    expect(deleteStub.mock.calls[0][0]).toMatchObject({
      Key: {
        pk: 'user-case-note|456',
        sk: 'user|123',
      },
      TableName: 'efcms-dev',
    });
  });
});
