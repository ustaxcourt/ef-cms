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

  const templateHtml = `<div>
  <div>
  Hello DAWSON user,
  </div>
  <div style="margin-top: 20px;">
  The email on your account has been changed. Once verified, this email will be your login and where you will receive service. <span style="font-weight: bold;">After 24 hours, this link will expire.</span> 
  </div>
  <div style="margin-top: 20px;">
  <a href="${verificationLink}" style="background-color: #005ea2; color: white; line-height: 0.9; border-radius: 0.25rem; text-decoration: none; font-size: 1.06rem; padding: .6rem 2.25rem; font-family: Source Sans Pro Web,Helvetica Neue,Helvetica,Roboto,Arial,sans-serif;">Verify Email</a>
  </div>
  <div style="margin-top: 20px;">
  <span>Or you can use this URL: </span>
  <a href="${verificationLink}">${verificationLink}</a>
  </div>
  <div style="margin-top: 20px;">
  If you did not make this change, please contact support at <a href="mailto:dawson.support@ustaxcourt.gov">dawson.support@ustaxcourt.gov</a>.
  </div>
  <div>
  <hr style="margin-top: 20px; border-top:1px solid #000000;">
  <div style="margin-top: 20px;">
    <span>This is an automated email. We are unable to respond to any messages sent to this email address.</span>
  </div>
  </div>`;

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
