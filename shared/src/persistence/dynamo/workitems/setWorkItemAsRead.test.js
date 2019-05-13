const client = require('../../dynamodbClientService');
const sinon = require('sinon');
const { setWorkItemAsRead } = require('./setWorkItemAsRead');

describe('setWorkItemAsRead', () => {
  let getCurrentUserStub;

  beforeEach(() => {
    sinon.stub(client, 'update').resolves(null);
  });

  afterEach(() => {
    client.update.restore();
  });

  it('invokes the peristence layer with pk of {userId}|unread-message and other expected params', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
      getCurrentUser: getCurrentUserStub,
    };
    await setWorkItemAsRead({
      applicationContext,
      userId: '123',
      workItemId: 'abc',
    });
    expect(client.update.getCall(0).args[0]).toMatchObject({
      Key: {
        pk: '123|workItem',
        sk: 'abc',
      },
    });
  });
});
