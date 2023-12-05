import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { sendSlackNotification } from './sendSlackNotification';

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
      .getDispatchNotification.mockReturnValue([]);
  });

  it('sends a message to the Slack webhook', async () => {
    await sendSlackNotification({
      applicationContext,
      text: 'How about now?',
      topic: 'test-topic',
    });

    expect(applicationContext.getHttpClient).toHaveBeenCalled();
    expect(applicationContext.getHttpClient().post).toHaveBeenCalledWith(
      'https://slack.example.com',
      {
        text: 'How about now?',
      },
    );
  });

  it('should check persistence to see if we have recently messaged the specified topic', async () => {
    await sendSlackNotification({
      applicationContext,
      text: 'How about now?',
      topic: 'test-topic',
    });

    expect(
      applicationContext.getPersistenceGateway().getDispatchNotification,
    ).toHaveBeenCalledWith({
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
    ).toHaveBeenCalledWith({
      applicationContext,
      topic: 'test-topic',
    });
  });

  it('does not call slack webhook if persistence check says that we notified the topic', async () => {
    applicationContext
      .getPersistenceGateway()
      .getDispatchNotification.mockReturnValue([
        {
          pk: 'dispatch-notification',
          sk: 'test-topic',
          ttl: 50,
        },
      ]);

    await sendSlackNotification({
      applicationContext,
      text: 'How about now?',
      topic: 'test-topic',
    });

    expect(applicationContext.getHttpClient().post).not.toHaveBeenCalled();
  });
});
