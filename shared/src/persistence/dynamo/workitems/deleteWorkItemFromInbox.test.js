const sinon = require('sinon');
const { deleteWorkItemFromInbox } = require('./deleteWorkItemFromInbox');

describe('deleteWorkItemFromInbox', () => {
  let deleteStub;

  beforeEach(() => {
    deleteStub = sinon.stub().returns({
      promise: async () => true,
    });
  });

  it('invokes the persistence layer with pk of {assigneeId}|workItem, docket|workItem and other expected params', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        delete: deleteStub,
      }),
    };
    await deleteWorkItemFromInbox({
      applicationContext,
      workItem: {
        assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        section: 'docket',
        workItemId: '123',
      },
    });
    expect(deleteStub.getCall(0).args[0]).toMatchObject({
      Key: {
        pk: 'user-1805d1ab-18d0-43ec-bafb-654e83405416',
        sk: 'workitem-123',
      },
    });
    expect(deleteStub.getCall(1).args[0]).toMatchObject({
      Key: {
        pk: 'section-docket',
        sk: 'workitem-123',
      },
    });
  });

  it('invokes the persistence layer with pk of docket|workItem and other expected params when assigneeId is not set', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        delete: deleteStub,
      }),
    };
    await deleteWorkItemFromInbox({
      applicationContext,
      workItem: {
        section: 'docket',
        workItemId: '123',
      },
    });
    expect(deleteStub.getCall(0).args[0]).toMatchObject({
      Key: {
        pk: 'section-docket',
        sk: 'workitem-123',
      },
    });
  });
});
