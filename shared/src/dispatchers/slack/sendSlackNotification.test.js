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
  });

  it('sends a message to the Slack webhook', async () => {
    const resp = await sendSlackNotification({
      applicationContext,
      text: 'How about now?',
    });

    expect(applicationContext.getHttpClient).toBeCalled();
    expect(applicationContext.getHttpClient().post).toBeCalledWith(
      'https://slack.example.com',
      {
        text: 'How about now?',
      },
    );
    expect(resp).toBe('ok');
  });
});
