const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { deleteWorkItemFromSection } = require('./deleteWorkItemFromSection');

describe('deleteWorkItemFromSection', () => {
  let deleteStub;

  beforeEach(() => {
    deleteStub = jest.fn().mockReturnValue({
      promise: async () => null,
    });
  });

  it('invokes the persistence layer with pk of irsHoldingQueue|workItem and other expected params', async () => {
    applicationContext.getDocumentClient.mockReturnValue({
      delete: deleteStub,
    });
    await deleteWorkItemFromSection({
      applicationContext,
      workItem: {
        section: 'irsHoldingQueue',
        workItemId: '123',
      },
    });
    expect(deleteStub.mock.calls[0][0]).toMatchObject({
      Key: {
        pk: 'section|irsHoldingQueue',
        sk: 'work-item|123',
      },
    });
  });
});
