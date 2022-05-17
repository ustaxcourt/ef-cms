const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { sendSlackNotification } = require('./sendSlackNotification');

describe('sendSlackNotification', () => {
  beforeEach(() => {
    applicationContext.getSlackWebhookUrl.mockReturnValueOnce(
      'https://slack.example.com',
    );

    applicationContext
      .getHttpClient()
      .post.mockReturnValue(Promise.resolve({ data: 'ok' }));

    applicationContext
      .getPersistenceGateway()
      .getDispatchNotification.mockReturnValue(undefined);
  });

  it('sends a message to the Slack webhook', async () => {
    await sendSlackNotification({
      applicationContext,
      text: 'How about now?',
      topic: 'test-topic',
    });

    expect(applicationContext.getHttpClient).toBeCalled();
    expect(applicationContext.getHttpClient().post).toBeCalledWith(
      'https://slack.example.com',
      {
        text: 'How about now?',
      },
    );
  });

  it('sends checks persistence to see if we have recently messaged the specified topic', async () => {
    await sendSlackNotification({
      applicationContext,
      text: 'How about now?',
      topic: 'test-topic',
    });

    expect(
      applicationContext.getPersistenceGateway().getDispatchNotification,
    ).toBeCalledWith({
      applicationContext,
      topic: 'test-topic',
    });
  });

  it('saves a record to persistence to signal that we have recently messaged the specified topic', async () => {
    await sendSlackNotification({
      applicationContext,
      text: 'How about now?',
      topic: 'test-topic',
    });

    expect(
      applicationContext.getPersistenceGateway().saveDispatchNotification,
    ).toBeCalledWith({
      applicationContext,
      topic: 'test-topic',
    });
  });

  it('does not call slack webhook if persistence check says that we notified the topic', async () => {
    applicationContext
      .getPersistenceGateway()
      .getDispatchNotification.mockReturnValue({
        pk: 'dispatch-notification',
        sk: 'test-topic',
        ttl: 50,
      });

    await sendSlackNotification({
      applicationContext,
      text: 'How about now?',
      topic: 'test-topic',
    });

    expect(applicationContext.getHttpClient().post).not.toBeCalled();
  });
});
