/**
 * sendSlackNotification
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.text the message to dispatch
 * @param {string} providers.topic the topic of the message to dispatch (to prevent spamming)
 */
exports.sendSlackNotification = async ({ applicationContext, text, topic }) => {
  const url = applicationContext.getSlackWebhookUrl();
  if (!url) {
    return;
  }

  const hasRecentNotification = await applicationContext
    .getPersistenceGateway()
    .getDispatchNotification({
      applicationContext,
      topic,
    });

  if (hasRecentNotification) {
    return;
  }

  await applicationContext.getHttpClient().post(url, {
    text,
  });

  await applicationContext.getPersistenceGateway().saveDispatchNotification({
    applicationContext,
    topic,
  });
};
