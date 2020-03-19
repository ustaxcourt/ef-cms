const { updateWorkItem } = require('./updateWorkItem');

describe('updateWorkItem', () => {
  let putStub;
  beforeEach(() => {
    putStub = jest.fn().mockReturnValue({
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
    expect(putStub.mock.calls[0][0]).toMatchObject({
      Item: {
        assigneeId: 'bob',
        pk: 'work-item|123',
        sk: 'work-item|123',
        workItemId: '123',
      },
      applicationContext: { environment: { stage: 'dev' } },
    });
  });
});
