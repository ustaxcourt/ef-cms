/**
 * sendNotificationOfSealing
 *
 * This broadcasts a message to our Notification Service that a case has been sealed
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.docketNumber the Case that is being sealed (or where the docket entry lives)
 * @param {string} providers.docketEntryId the identifier of the Docket Entry that is being sealed
 * @returns {Promise} upon completion of notification delivery
 */
exports.sendNotificationOfSealing = async (
  applicationContext,
  { docketEntryId, docketNumber },
) => {
  if (process.env.PROD_ENV_ACCOUNT_ID !== process.env.AWS_ACCOUNT_ID) {
    return;
  }

  const params = {
    Message: JSON.stringify({ docketEntryId, docketNumber }),
    TopicArn: `arn:aws:sns:us-east-1:${process.env.AWS_ACCOUNT_ID}:seal_notifier`,
  };

  const maxRetries = 5;

  for (let retryCount = 0; retryCount <= maxRetries; retryCount++) {
    try {
      const res = await applicationContext
        .getNotificationService()
        .publish(params)
        .promise();
      applicationContext.logger.info('sent notification of sealing', {
        MessageId: res.MessageId,
        docketEntryId,
        docketNumber,
      });
      return;
    } catch (err) {
      applicationContext.logger.warn('error attempting to send notification', {
        err,
        retryCount,
      });
    }
  }

  applicationContext.logger.error(
    'complete failure attempting to send notification of sealing an item',
  );
};
