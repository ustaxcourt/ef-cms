const sinon = require('sinon');
const { deleteWorkItemFromSection } = require('./deleteWorkItemFromSection');

describe('deleteWorkItemFromSection', () => {
  let deleteStub;

  beforeEach(() => {
    deleteStub = sinon.stub().returns({
      promise: async () => null,
    });
  });

  it('invokes the persistence layer with pk of irsHoldingQueue|workItem and other expected params', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        delete: deleteStub,
      }),
    };
    await deleteWorkItemFromSection({
      applicationContext,
      workItem: {
        section: 'irsHoldingQueue',
        workItemId: '123',
      },
    });
    expect(deleteStub.getCall(0).args[0]).toMatchObject({
      Key: {
        pk: 'section-irsHoldingQueue',
        sk: 'workitem-123',
      },
    });
  });
});
