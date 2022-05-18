const {
  reactTemplateGenerator,
} = require('../../utilities/generateHTMLTemplateForPDF/reactTemplateGenerator');

/**
 * handleBounceNotificationInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.bounce an object containing the information about the bounced email
 * @returns {Promise<object>} resolves upon completion
 */
exports.handleBounceNotificationInteractor = async (
  applicationContext,
  { bounce },
) => {
  if (bounce?.bounceType !== 'Permanent') {
    return;
  }

  const IRS_SUPERUSER_EMAIL = applicationContext.getIrsSuperuserEmail();
  const isIrsSuperUser = bounce?.bouncedRecipients?.some(
    recipient => recipient.emailAddress === IRS_SUPERUSER_EMAIL,
  );
  if (!isIrsSuperUser) {
    return;
  }

  const destinations = applicationContext.getBounceAlertRecipients();
  if (destinations) {
    await applicationContext.getDispatchers().sendBulkTemplatedEmail({
      applicationContext,
      defaultTemplateData: {
        emailContent: reactTemplateGenerator({
          componentName: 'BouncedEmailAlert',
          data: {
            ...bounce,
            bouncedRecipients: bounce.bouncedRecipients
              .map(recipient => recipient.emailAddress)
              .join(', '),
            currentDate: applicationContext
              .getUtilities()
              .formatNow('DATE_TIME_TZ'),
          },
        }),
      },
      destinations: destinations.map(email => ({ email })),
      templateName: process.env.BOUNCE_ALERT_TEMPLATE,
    });
  }

  await applicationContext.getDispatchers().sendSlackNotification({
    applicationContext,
    text: `:warning: An Email to the IRS Super User (${IRS_SUPERUSER_EMAIL}) has triggered a ${bounce.bounceType} bounce (${bounce.bounceSubType})`,
    topic: 'bounce-notification',
  });
};
