const client = require('../../dynamodbClientService');
const sinon = require('sinon');
const { setWorkItemAsRead } = require('./setWorkItemAsRead');

describe('setWorkItemAsRead', () => {
  let getCurrentUserStub;

  beforeEach(() => {
    sinon.stub(client, 'delete').resolves(null);
  });

  afterEach(() => {
    client.delete.restore();
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
      messageId: 'abc',
      userId: '123',
    });
    expect(client.delete.getCall(0).args[0]).toMatchObject({
      applicationContext: { environment: { stage: 'dev' } },
      key: {
        pk: '123|unread-message',
        sk: 'abc',
      },
    });
  });
});
