/**
 * Send email with link to verify pending email
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.pendingEmail the pending email
 * @param {string} providers.pendingEmailVerificationToken the pending email
 */
export const sendEmailVerificationLink = async ({
  applicationContext,
  pendingEmail,
  pendingEmailVerificationToken,
}) => {
  const verificationLink = `https://app.${process.env.EFCMS_DOMAIN}/verify-email?token=${pendingEmailVerificationToken}`;

  const templateHtml = `The email on your account has been changed. Once verified, this email will be your login and where you will receive service.<br><a href="${verificationLink}">Verify your email.</a><br><br>If you did not make this change, please contact support at <a href="mailto:dawson.support@ustaxcourt.gov">dawson.support@ustaxcourt.gov</a>.`;

  const destination = {
    email: pendingEmail,
    templateData: {
      emailContent: templateHtml,
    },
  };

  await applicationContext.getDispatchers().sendBulkTemplatedEmail({
    applicationContext,
    defaultTemplateData: {
      emailContent: 'Please confirm your new email',
    },
    destinations: [destination],
    templateName: process.env.EMAIL_CHANGE_VERIFICATION_TEMPLATE,
  });
};
