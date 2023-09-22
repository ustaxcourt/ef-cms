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
export const sendNotificationOfSealing = async (
  applicationContext,
  { docketEntryId, docketNumber },
) => {
  const params = {
    Message: JSON.stringify({ docketEntryId, docketNumber }),
    TopicArn: `arn:aws:sns:us-east-1:${process.env.AWS_ACCOUNT_ID}:seal_notifier`,
  };

  const maxRetries = 5;

  for (let retryCount = 0; retryCount <= maxRetries; retryCount++) {
    try {
      const response = await applicationContext
        .getNotificationService()
        .publish(params)
        .promise();
      applicationContext.logger.info('sent notification of sealing', {
        docketEntryId,
        docketNumber,
        response,
      });
      return;
    } catch (err) {
      applicationContext.logger.error('error attempting to send notification', {
        err,
        retryCount,
      });
    }
  }

  applicationContext.logger.error(
    'complete failure attempting to send notification of sealing an item',
  );
};
