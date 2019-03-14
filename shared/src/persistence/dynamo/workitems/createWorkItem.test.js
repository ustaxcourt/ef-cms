const { createWorkItem } = require('./createWorkItem');

const sinon = require('sinon');

describe('createWorkItem', () => {
  let applicationContext;
  let putStub;

  const workItem = {
    assigneeId: '123',
    createdAt: '100',
    section: 'docket',
    sentByUserId: 'a_user',
    workItemId: 'a_id',
  };

  beforeEach(() => {
    putStub = sinon.stub().returns({
      promise: async () => null,
    });

    applicationContext = {
      environment: {
        stage: 'dev',
      },
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
        createdAt: '100',
        pk: 'a_id',
        section: 'docket',
        sentByUserId: 'a_user',
        sk: 'a_id',
        workItemId: 'a_id',
      },
      TableName: 'efcms-dev',
    });
  });

  it('creates a record for the individual inbox', async () => {
    await createWorkItem({
      applicationContext,
      workItem,
    });
    expect(putStub.getCall(1).args[0]).toMatchObject({
      Item: {
        pk: '123|workItem',
        sk: 'a_id',
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
    expect(putStub.getCall(2).args[0]).toMatchObject({
      Item: {
        pk: 'a_user|sentWorkItem',
        sk: '100',
        workItemId: 'a_id',
      },
      TableName: 'efcms-dev',
    });
  });

  it('creates a record for the section inbox', async () => {
    await createWorkItem({
      applicationContext,
      workItem,
    });
    expect(putStub.getCall(3).args[0]).toMatchObject({
      Item: {
        pk: 'docket|workItem',
        sk: 'a_id',
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
    expect(putStub.getCall(4).args[0]).toMatchObject({
      Item: {
        pk: 'docket|sentWorkItem',
        sk: '100',
        workItemId: 'a_id',
      },
      TableName: 'efcms-dev',
    });
  });
});
