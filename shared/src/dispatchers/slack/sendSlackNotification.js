/**
 * sendSlackNotification
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.text the message to dispatch
 */
exports.sendSlackNotification = async ({ applicationContext, message }) => {
  await applicationContext
    .getHttpClient()
    .post(applicationContext.getSlackWebhookUrl(), {
      text: message,
    });
};
