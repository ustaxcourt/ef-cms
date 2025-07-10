import { ServerApplicationContext } from '@web-api/applicationContext';

/**
 * sendSlackNotification
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.text the message to dispatch
 * @param {string} providers.topic the topic of the message to dispatch (to prevent spamming)
 */
export const sendSlackNotification = async ({
  applicationContext,
  text,
  topic,
}: {
  applicationContext: ServerApplicationContext;
  text: string;
  topic: string;
}) => {
  const slackWebhookUrl = applicationContext.getSlackWebhookUrl();
  if (!slackWebhookUrl) {
    applicationContext.logger.warn(
      'No environment variable specified for Slack Webhook URL',
    );
    return;
  }

  const recentNotifications = await applicationContext
    .getPersistenceGateway()
    .getDispatchNotification(topic);

  if (recentNotifications.length) {
    // topic has recently been notified; ignore this request
    return;
  }

  await applicationContext.getHttpClient().post(slackWebhookUrl, {
    text,
  });

  await applicationContext
    .getPersistenceGateway()
    .saveDispatchNotification(topic);
};
