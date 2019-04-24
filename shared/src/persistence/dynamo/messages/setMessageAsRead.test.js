const client = require('../../dynamodbClientService');
const sinon = require('sinon');
const { setMessageAsRead } = require('./setMessageAsRead');

describe('setMessageAsRead', () => {
  let getCurrentUserStub;

  beforeEach(() => {
    sinon.stub(client, 'put').resolves(null);
  });

  afterEach(() => {
    client.put.restore();
  });

  it('invokes the peristence layer with pk of {userId}|read-messages and other expected params', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
      getCurrentUser: getCurrentUserStub,
    };
    await setMessageAsRead({
      applicationContext,
      messageId: 'abc',
      userId: '123',
    });
    expect(client.put.getCall(0).args[0]).toMatchObject({
      Item: {
        pk: '123|read-messages',
        sk: 'abc',
      },
      applicationContext: { environment: { stage: 'dev' } },
    });
  });
});
