const {
  reactTemplateGenerator,
} = require('../../utilities/generateHTMLTemplateForPDF/reactTemplateGenerator');

/**
 * Helper function to easily parse the information we need from the Notification about the bounce
 *
 * @param {object} providers the providers object
 * @param {object} providers.bounce information pertaining the the bounce event
 * @param {object} providers.mail information pertaining to the email that bounced
 * @returns {object} only the information we need about the bounce
 */
exports.parseBounceNotification = ({ bounce, mail }) => {
  return {
    bounceRecipient: bounce.bouncedRecipients[0].emailAddress,
    bounceSubType: bounce.bounceSubType,
    bounceType: bounce.bounceType,
    errorMessage: bounce.bouncedRecipients[0].diagnosticCode,
    subject: mail.commonHeaders.subject,
  };
};

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
  notification,
) => {
  const { bounceRecipient, bounceSubType, bounceType, errorMessage, subject } =
    exports.parseBounceNotification(notification);

  if (bounceType !== 'Permanent') {
    return;
  }

  const IRS_SUPERUSER_EMAIL = applicationContext.getIrsSuperuserEmail();
  if (bounceRecipient !== IRS_SUPERUSER_EMAIL) {
    return;
  }

  const environmentName = applicationContext.getEnvironment().stage;
  const alertRecipients = applicationContext.getBounceAlertRecipients();

  if (alertRecipients) {
    await applicationContext.getDispatchers().sendBulkTemplatedEmail({
      applicationContext,
      defaultTemplateData: {
        emailContent: reactTemplateGenerator({
          componentName: 'BouncedEmailAlert',
          data: {
            bounceRecipient,
            bounceSubType,
            bounceType,
            currentDate: applicationContext
              .getUtilities()
              .formatNow('DATE_TIME_TZ'),
            environmentName,
            errorMessage,
            subject,
          },
        }),
      },
      destinations: alertRecipients.map(email => ({ email })),
      templateName: process.env.BOUNCE_ALERT_TEMPLATE,
    });
  }

  await applicationContext.getDispatchers().sendSlackNotification({
    applicationContext,
    text: `:warning: (${environmentName} environment) An Email to the IRS Super User (${IRS_SUPERUSER_EMAIL}) has triggered a ${bounceType} bounce (${bounceSubType})`,
    topic: 'bounce-notification',
  });
};
