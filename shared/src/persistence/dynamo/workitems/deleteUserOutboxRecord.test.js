const sinon = require('sinon');
const { deleteUserOutboxRecord } = require('./deleteUserOutboxRecord');

describe('deleteUserOutboxRecord', () => {
  let deleteStub;

  beforeEach(() => {
    deleteStub = sinon.stub().returns({
      promise: async () => true,
    });
  });

  it('invokes the persistence layer with pk of user-outbox-${userId} and sk of createdAt', async () => {
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
      createdAt: '2020-01-02T16:05:45.979Z',
      userId: '91414cfb-4fc9-440d-be07-a601e676fb6c',
    });
    expect(deleteStub.getCall(0).args[0]).toMatchObject({
      Key: {
        pk: 'user-outbox-91414cfb-4fc9-440d-be07-a601e676fb6c',
        sk: '2020-01-02T16:05:45.979Z',
      },
    });
  });
});
