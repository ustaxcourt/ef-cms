const sinon = require('sinon');
const { createWorkItem } = require('./createWorkItem');

describe('createWorkItem', () => {
  let applicationContext;
  let putStub;
  let getCurrentUserStub;

  const workItem = {
    assigneeId: '123',
    caseId: '123',
    createdAt: '100',
    section: 'docket',
    sentByUserId: 'a_user',
    workItemId: 'a_id',
  };

  beforeEach(() => {
    putStub = sinon.stub().returns({
      promise: async () => null,
    });

    getCurrentUserStub = sinon.stub().returns({
      section: 'docket',
      userId: '123',
    });

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getCurrentUser: getCurrentUserStub,
      getDocumentClient: () => ({
        put: putStub,
      }),
    };
  });

  it('attempts to persist the work item', async () => {
    await createWorkItem({
      applicationContext,
      workItem,
    });
    expect(putStub.getCall(0).args[0]).toMatchObject({
      Item: {
        caseId: '123',
        pk: 'workitem-a_id',
        sk: 'workitem-a_id',
        workItemId: 'a_id',
      },
      TableName: 'efcms-dev',
    });
  });

  it('creates a mapping record between case and work item', async () => {
    await createWorkItem({
      applicationContext,
      workItem,
    });
    expect(putStub.getCall(1).args[0]).toMatchObject({
      Item: {
        pk: '123|workItem',
        sk: 'a_id',
      },
      TableName: 'efcms-dev',
    });
  });

  it('creates a record for the individual inbox', async () => {
    await createWorkItem({
      applicationContext,
      workItem,
    });
    expect(putStub.getCall(2).args[0]).toMatchObject({
      Item: {
        pk: 'user-123',
        sk: 'workitem-a_id',
        workItemId: 'a_id',
      },
      TableName: 'efcms-dev',
    });
  });

  it('creates a record for the individual outbox', async () => {
    await createWorkItem({
      applicationContext,
      workItem,
    });
    expect(putStub.getCall(3).args[0]).toMatchObject({
      Item: {
        pk: 'user-outbox-123',
        sk: '100',
      },
      TableName: 'efcms-dev',
    });
  });

  it('creates a record for the section inbox', async () => {
    await createWorkItem({
      applicationContext,
      workItem,
    });
    expect(putStub.getCall(4).args[0]).toMatchObject({
      Item: {
        pk: 'section-docket',
        sk: 'workitem-a_id',
        workItemId: 'a_id',
      },
      TableName: 'efcms-dev',
    });
  });

  it('creates a record for the section outbox', async () => {
    await createWorkItem({
      applicationContext,
      workItem,
    });
    expect(putStub.getCall(5).args[0]).toMatchObject({
      Item: {
        pk: 'section-outbox-docket',
        sk: '100',
        workItemId: 'a_id',
      },
      TableName: 'efcms-dev',
    });
  });
});
