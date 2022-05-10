/**
 * sendSlackNotification
 *
 * @param {object} applicationContext the application context
 * @param {string} message the message to dispatch
 * @returns {promise}
 */
exports.sendSlackNotification = async ({ applicationContext, message }) => {
  const response = await applicationContext
    .getHttpClient()
    .post(applicationContext.getSlackWebhookUrl(), {
      message,
    });
  return response.data;
};
