/**
 * sendNotificationOfSealing
 *
 * This broadcasts a message to our Notification Service that a case has been sealed
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.docketNumber the Case that is being sealed (or where the docket entry lives)
 * @param {string} providers.docketEntryId the identifier of the Docket Entry that is being sealed
 * @returns {Promise} upon completion of notification delivery
 */
exports.sendNotificationOfSealing = async ({
  applicationContext,
  docketEntryId,
  docketNumber,
}) => {
  if (applicationContext.environment.stage != 'prod') {
    return;
  }

  const params = {
    Message: JSON.stringify({ docketEntryId, docketNumber }),
    TopicArn: `arn:aws:sns:us-east-1:${process.env.AWS_ACCOUNT_ID}:sealed_case_notifier`,
  };

  await applicationContext.getNotificationService().publish(params);
  // TODO: what if it fails? Need to retry
};
