const { deleteUserFromCase } = require('./deleteUserFromCase');

describe('deleteUserFromCase', function() {
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

  it('attempts to delete the user from the case', async () => {
    await deleteUserFromCase({
      applicationContext,
      caseId: '456',
      userId: '123',
    });

    expect(deleteStub.mock.calls[0][0]).toMatchObject({
      Key: {
        pk: 'user|123',
        sk: 'case|456',
      },
      TableName: 'efcms-dev',
    });
  });
});
