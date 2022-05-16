/**
 * handleBounceNotificationInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.bounce an object containing the information about the bounce
 * @returns {Promise<object>} resolves upon completion
 */
exports.handleBounceNotificationInteractor = async (
  applicationContext,
  { bounce },
) => {
  if (bounce.bounceType !== 'Permanent') {
    return;
  }

  const IRS_SUPERUSER_EMAIL = applicationContext.getIrsSuperuserEmail();
  const isIrsSuperUser = bounce.bouncedRecipients?.some(
    recipient => recipient.emailAddress === IRS_SUPERUSER_EMAIL,
  );
  if (!isIrsSuperUser) {
    return;
  }

  const message = `An Email to the IRS Super User (${IRS_SUPERUSER_EMAIL}) has triggered a ${bounce.bounceType} bounce (${bounce.bounceSubType})`;

  const destinations = applicationContext.getBounceAlertRecipients();
  if (destinations) {
    await applicationContext.getDispatchers().sendBulkTemplatedEmail({
      applicationContext,
      defaultTemplateData: {
        emailContent: message,
      },
      destinations: destinations.map(email => ({ email })),
      templateName: process.env.BOUNCE_ALERT_TEMPLATE,
    });
  }

  const hasRecentNotification = applicationContext
    .getPersistenceGateway()
    .getDispatchNotification({
      applicationContext,
      channel: 'bounce-notification',
    });

  if (!hasRecentNotification) {
    await applicationContext.getDispatchers().sendSlackNotification({
      applicationContext,
      text: message,
    });
    await applicationContext.getPersistenceGateway().saveDispatchNotification({
      applicationContext,
      channel: 'bounce-notification',
    });
  }
};
