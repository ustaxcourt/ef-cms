/**
 * handleBounceNotificationInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {array} providers.bouncedRecipients an array of the email addresses for this bounce
 * @param {string} providers.bounceType the type of the SES bounced email
 * @param {string} providers.bounceSubType the sub type of the SES bounced email
 * @returns {Promise<object>} resolves upon completion
 */
exports.handleBounceNotificationInteractor = async (
  applicationContext,
  obj,
) => {
  if (!obj.bounce) {
    applicationContext.logger.console.warn(
      'received a bounce notification, but missing bounce attribute',
      obj,
    );
    return;
  }

  const isIrsSuperUser = obj.bounce.bouncedRecipients?.some(
    recipient =>
      recipient.emailAddress === applicationContext.getIrsSuperuserEmail(),
  );

  if (!isIrsSuperUser || obj.bounce.bounceType !== 'Permanent') {
    return;
  }

  await applicationContext.getDispatchers().sendBulkTemplatedEmail({
    applicationContext,
    defaultTemplateData: {},
    destinations: applicationContext.getBounceAlertRecipients(),
    templateName: process.env.EMAIL_BOUNCED_SUPER_USER_TEMPLATE,
  });

  await applicationContext.getDispatchers().sendSlackNotification({
    applicationContext,
    message: `An Email to the IRS Super User has triggered a ${obj.bounce.bounceType} bounce (${obj.bounce.bounceSubType})`,
  });
};
