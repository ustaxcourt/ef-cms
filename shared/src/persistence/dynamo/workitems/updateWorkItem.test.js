const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { updateWorkItem } = require('./updateWorkItem');

describe('updateWorkItem', () => {
  beforeAll(() => {
    applicationContext.getDocumentClient().put.mockReturnValue({
      promise: async () => null,
    });
  });

  it('invokes the persistence layer with pk of {workItemId}, sk of {workItemId} and other expected params', async () => {
    await updateWorkItem({
      applicationContext,
      workItemToUpdate: {
        assigneeId: 'bob',
        workItemId: '123',
      },
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        assigneeId: 'bob',
        pk: 'work-item|123',
        sk: 'work-item|123',
        workItemId: '123',
      },
      applicationContext: { environment: { stage: 'local' } },
    });
  });
});
