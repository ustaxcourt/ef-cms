const { deleteUserOutboxRecord } = require('./deleteUserOutboxRecord');

describe('deleteUserOutboxRecord', () => {
  let deleteStub;

  beforeEach(() => {
    deleteStub = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue(null),
    });
  });

  it('deletes user outbox record', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        delete: deleteStub,
      }),
    };
    await deleteUserOutboxRecord({
      applicationContext,
      createdAt: 'sometime',
      userId: 'user-123',
    });

    expect(deleteStub.mock.calls[0][0]).toMatchObject({
      Key: {
        pk: 'user-outbox|user-123',
        sk: 'sometime',
      },
    });
  });
});
