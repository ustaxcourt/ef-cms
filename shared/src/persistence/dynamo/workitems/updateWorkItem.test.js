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
        assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
        workItemId: '123',
      },
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
        pk: 'work-item|123',
        sk: 'work-item|123',
        workItemId: '123',
      },
      applicationContext: { environment: { stage: 'local' } },
    });
  });
});
