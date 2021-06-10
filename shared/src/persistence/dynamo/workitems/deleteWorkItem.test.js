const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { deleteWorkItem } = require('./deleteWorkItem');

describe('deleteWorkItem', () => {
  beforeAll(() => {
    applicationContext.getDocumentClient().delete.mockReturnValue({
      promise: async () => true,
    });
  });

  it('invokes the persistence layer with pk of work-item|{workItemId} and sk of work-item|{workItemId}', async () => {
    const mockWorkItemId = '437da979-89f3-49fc-bf3e-7b09d9691410';

    await deleteWorkItem({
      applicationContext,
      workItem: {
        workItemId: mockWorkItemId,
      },
    });

    expect(
      applicationContext.getDocumentClient().delete.mock.calls[0][0],
    ).toMatchObject({
      Key: {
        pk: `work-item|${mockWorkItemId}`,
        sk: `work-item|${mockWorkItemId}`,
      },
    });
  });
});
