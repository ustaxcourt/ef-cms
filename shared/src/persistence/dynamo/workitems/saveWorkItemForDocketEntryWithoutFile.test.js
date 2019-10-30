const sinon = require('sinon');
const {
  saveWorkItemForDocketEntryWithoutFile,
} = require('./saveWorkItemForDocketEntryWithoutFile');

describe('saveWorkItemForDocketEntryWithoutFile', () => {
  let putStub;
  let getStub;

  beforeEach(() => {
    putStub = sinon.stub().returns({
      promise: async () => ({
        section: 'docket',
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    });
    getStub = sinon.stub().returns({
      promise: async () => ({
        Item: {
          section: 'docket',
          userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        },
      }),
    });
  });

  it('invokes the persistence layer 4 times to store the work item, user and section inbox records, and work item mapping record', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
      getCurrentUser: () => ({
        section: 'docket',
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      }),
      getDocumentClient: () => ({
        get: getStub,
        put: putStub,
      }),
    };
    await saveWorkItemForDocketEntryWithoutFile({
      applicationContext,
      workItem: {
        assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        caseId: '456',
        section: 'docket',
        workItemId: '123',
      },
    });

    expect(putStub.getCall(0).args[0]).toMatchObject({
      Item: {
        pk: 'workitem-123',
        sk: 'workitem-123',
      },
    });
    expect(putStub.getCall(1).args[0]).toMatchObject({
      Item: {
        pk: 'section-docket',
        workItemId: '123',
      },
    });
    expect(putStub.getCall(2).args[0]).toMatchObject({
      Item: {
        pk: 'user-1805d1ab-18d0-43ec-bafb-654e83405416',
        workItemId: '123',
      },
    });
    expect(putStub.getCall(3).args[0]).toMatchObject({
      Item: {
        pk: '456|workItem',
        sk: '123',
      },
    });
  });
});
