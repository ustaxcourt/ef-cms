const sinon = require('sinon');
const { updateWorkItem } = require('./updateWorkItem');

describe('updateWorkItem', () => {
  let putStub;
  beforeEach(() => {
    putStub = sinon.stub().returns({
      promise: async () => null,
    });
  });

  it('invokes the persistence layer with pk of {workItemId}, sk of {workItemId} and other expected params', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        put: putStub,
      }),
    };
    await updateWorkItem({
      applicationContext,
      workItemToUpdate: {
        assigneeId: 'bob',
        workItemId: '123',
      },
    });
    expect(putStub.getCall(0).args[0]).toMatchObject({
      Item: {
        assigneeId: 'bob',
        pk: 'workitem-123',
        sk: 'workitem-123',
        workItemId: '123',
      },
      applicationContext: { environment: { stage: 'dev' } },
    });
  });
});
