const client = require('../../dynamodbClientService');
const sinon = require('sinon');
const { updateWorkItem } = require('./updateWorkItem');

describe('updateWorkItem', () => {
  beforeEach(() => {
    sinon.stub(client, 'put').resolves([
      {
        pk: 'abc',
        sk: 'abc',
        workItemId: 'abc',
      },
    ]);
  });

  afterEach(() => {
    client.put.restore();
  });

  it('invokes the peristence layer with pk of {workItemId}, sk of {workItemId} and other expected params', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
    };
    await updateWorkItem({
      applicationContext,
      workItemToUpdate: {
        assigneeId: 'bob',
        workItemId: '123',
      },
    });
    expect(client.put.getCall(0).args[0]).toMatchObject({
      Item: {
        assigneeId: 'bob',
        pk: '123',
        sk: '123',
        workItemId: '123',
      },
      applicationContext: { environment: { stage: 'dev' } },
    });
  });
});
