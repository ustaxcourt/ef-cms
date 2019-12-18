const sinon = require('sinon');
const { setWorkItemAsRead } = require('./setWorkItemAsRead');

describe('setWorkItemAsRead', () => {
  let updateStub;

  beforeEach(() => {
    updateStub = sinon.stub().returns({
      promise: async () => true,
    });
  });

  it('invokes the persistence layer with pk of {userId}|workItem and other expected params', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        update: updateStub,
      }),
    };
    await setWorkItemAsRead({
      applicationContext,
      userId: '123',
      workItemId: 'abc',
    });
    expect(updateStub.getCall(0).args[0]).toMatchObject({
      Key: {
        pk: 'user-123',
        sk: 'workitem-abc',
      },
    });
  });
});
