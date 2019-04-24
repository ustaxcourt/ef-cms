const client = require('../../dynamodbClientService');
const sinon = require('sinon');
const { deleteWorkItemFromInbox } = require('./deleteWorkItemFromInbox');

describe('deleteWorkItemFromInbox', () => {
  beforeEach(() => {
    sinon.stub(client, 'delete').resolves(null);
  });

  afterEach(() => {
    client.delete.restore();
  });

  it('invokes the peristence layer with pk of {assigneeId}|workItem, docket|workItem and other expected params', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
    };
    await deleteWorkItemFromInbox({
      applicationContext,
      workItem: {
        assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        section: 'docket',
        workItemId: '123',
      },
    });
    expect(client.delete.getCall(0).args[0]).toEqual({
      applicationContext: { environment: { stage: 'dev' } },
      key: {
        pk: '1805d1ab-18d0-43ec-bafb-654e83405416|workItem',
        sk: '123',
      },
    });
    expect(client.delete.getCall(1).args[0]).toEqual({
      applicationContext: { environment: { stage: 'dev' } },
      key: {
        pk: 'docket|workItem',
        sk: '123',
      },
    });
  });

  it('invokes the peristence layer with pk of docket|workItem and other expected params when assigneeId is not set', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
    };
    await deleteWorkItemFromInbox({
      applicationContext,
      workItem: {
        section: 'docket',
        workItemId: '123',
      },
    });
    expect(client.delete.getCall(0).args[0]).toEqual({
      applicationContext: { environment: { stage: 'dev' } },
      key: {
        pk: 'docket|workItem',
        sk: '123',
      },
    });
  });
});
