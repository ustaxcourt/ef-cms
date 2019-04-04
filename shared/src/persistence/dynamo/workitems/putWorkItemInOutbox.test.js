const client = require('../../dynamodbClientService');
const sinon = require('sinon');
const { putWorkItemInOutbox } = require('./putWorkItemInOutbox');

describe('putWorkItemInOutbox', () => {
  let getCurrentUserStub;

  beforeEach(() => {
    sinon.stub(client, 'put').resolves([
      {
        pk: 'abc',
        sk: 'abc',
        workItemId: 'abc',
      },
    ]);

    getCurrentUserStub = sinon.stub().returns({
      section: 'docket',
      userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    });
  });

  afterEach(() => {
    client.put.restore();
  });

  it('invokes the peristence layer with pk of {userId}|outbox and {section}|outbox and other expected params', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
      getCurrentUser: getCurrentUserStub,
    };
    await putWorkItemInOutbox({
      applicationContext,
      workItem: {
        workItemId: '123',
      },
    });
    expect(client.put.getCall(0).args[0]).toMatchObject({
      Item: {
        pk: '1805d1ab-18d0-43ec-bafb-654e83405416|outbox',
        workItemId: '123',
      },
      applicationContext: { environment: { stage: 'dev' } },
    });
    expect(client.put.getCall(1).args[0]).toMatchObject({
      Item: {
        pk: 'docket|outbox',
        workItemId: '123',
      },
      applicationContext: { environment: { stage: 'dev' } },
    });
  });
});
