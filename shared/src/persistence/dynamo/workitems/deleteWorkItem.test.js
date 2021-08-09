const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { deleteWorkItem } = require('./deleteWorkItem');

describe('deleteWorkItem', () => {
  beforeAll(() => {
    applicationContext.getDocumentClient().delete.mockReturnValue({
      promise: () => Promise.resolve(true),
    });
  });

  it('invokes the persistence layer with pk of case|{docketNumber} and sk of work-item|{workItemId}', async () => {
    const mockWorkItemId = '437da979-89f3-49fc-bf3e-7b09d9691410';
    const mockDocketNumber = '101-21';

    await deleteWorkItem({
      applicationContext,
      workItem: {
        docketNumber: mockDocketNumber,
        workItemId: mockWorkItemId,
      },
    });

    expect(
      applicationContext.getDocumentClient().delete.mock.calls[0][0],
    ).toMatchObject({
      Key: {
        pk: `case|${mockDocketNumber}`,
        sk: `work-item|${mockWorkItemId}`,
      },
    });
  });
});
