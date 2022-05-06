/**
 * handleBounceNotificationInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {array} providers.bouncedRecipients an array of the email addresses for this bounce
 * @param {string} providers.bouncType the type of the SES bounced email
 * @param {string} providers.bounceSubType the sub type of the SES bounced email
 * @returns {Promise<object>} item updated in persistence
 */
exports.handleBounceNotificationsInteractor = async (
  applicationContext,
  { bouncedRecipients, bounceSubType, bounceType },
) => {
  const isIrsSuperUser = bouncedRecipients?.some(
    recipient =>
      recipient.emailAddress === applicationContext.getIrsSuperuserEmail(),
  );

  if (!isIrsSuperUser || bounceType !== 'Permanent') {
    return;
  }

  // Warning Emails sent to specified addresses
  await applicationContext.getDispatchers().sendBulkTemplatedEmail({
    applicationContext,
    defaultTemplateData: {},
    destinations: process.env.EMAIL_BOUNCED_SUPER_USER_RECIPIENTS.split(','),
    templateName: process.env.EMAIL_BOUNCED_SUPER_USER_TEMPLATE,
  });

  // Slack notification occurs in specified channel
  await applicationContext.getDispatchers().sendSlackNotification({
    applicationContext,
    message: `An Email to the IRS Super User has triggered a ${bounceType} bounce`,
  });

  if (bounceSubType === 'OnAccountSuppressionList') {
    // They are removed from suppression list, unless they have been added to it five times in the last hour.
  }
};
