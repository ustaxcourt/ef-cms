import { BouncedEmailAlert } from '@shared/business/utilities/emailGenerator/emailTemplates/BouncedEmailAlert';
import React from 'react';
import ReactDOM from 'react-dom/server';

/**
 * Helper function to easily parse the information we need from the Notification about the bounce
 *
 * @param {object} providers the providers object
 * @param {object} providers.bounce information pertaining the the bounce event
 * @param {object} providers.mail information pertaining to the email that bounced
 * @returns {object} only the information we need about the bounce
 */
export const parseBounceNotification = ({ bounce, mail }) => {
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
export const handleBounceNotificationInteractor = async (
  applicationContext: IApplicationContext,
  notification: TNotification,
) => {
  const { bounceRecipient, bounceSubType, bounceType, errorMessage, subject } =
    parseBounceNotification(notification);

  if (bounceType !== 'Permanent') {
    return;
  }

  const IRS_SUPERUSER_EMAIL = applicationContext.getIrsSuperuserEmail();
  if (bounceRecipient !== IRS_SUPERUSER_EMAIL) {
    return;
  }

  const environmentName = applicationContext.getEnvironment().stage;
  const alertRecipients = applicationContext.getBounceAlertRecipients();

  const emailContent = ReactDOM.renderToString(
    React.createElement(BouncedEmailAlert, {
      bounceRecipient,
      bounceSubType,
      bounceType,
      currentDate: applicationContext.getUtilities().formatNow('DATE_TIME_TZ'),
      environmentName,
      errorMessage,
      subject,
    }),
  );

  if (alertRecipients) {
    await applicationContext.getDispatchers().sendBulkTemplatedEmail({
      applicationContext,
      defaultTemplateData: {
        emailContent,
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
