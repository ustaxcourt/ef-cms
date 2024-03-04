import { ServerApplicationContext } from '@web-api/applicationContext';
import qs from 'qs';

export async function createUserConfirmation(
  applicationContext: ServerApplicationContext,
  { email, userId }: { email: string; userId: string },
): Promise<{ confirmationCode: string }> {
  const existingConfirmationCode = await applicationContext
    .getPersistenceGateway()
    .getAccountConfirmationCode(applicationContext, { userId });

  let code: string;

  if (!existingConfirmationCode) {
    const { confirmationCode: newConfirmationCode } = await applicationContext
      .getPersistenceGateway()
      .generateAccountConfirmationCode(applicationContext, { userId });
    code = newConfirmationCode;
  } else {
    await applicationContext
      .getPersistenceGateway()
      .refreshConfirmationCodeExpiration(applicationContext, {
        confirmationCode: existingConfirmationCode,
        userId,
      });
    code = existingConfirmationCode;
  }

  const queryString = qs.stringify(
    { confirmationCode: code, email, userId },
    { encode: true },
  );
  const verificationLink = `https://app.${process.env.EFCMS_DOMAIN}/confirm-signup?${queryString}`;

  const emailBody = `<div>
    <div>Welcome to DAWSON!</div>
    <div style="margin-top: 20px;">
      Your account with DAWSON has been created. Use the button below to verify your email address. <span style="font-weight: bold;">After 24 hours, this link will expire.</span> 
    </div>
    <div style="margin-top: 20px;">
      <a href="${verificationLink}" style="background-color: #005ea2; color: white; line-height: 0.9; border-radius: 0.25rem; text-decoration: none; font-size: 1.06rem; padding: .6rem 2.25rem; font-family: Source Sans Pro Web,Helvetica Neue,Helvetica,Roboto,Arial,sans-serif;">Verify Email</a>
    </div>
    <div style="margin-top: 20px;">
    <span>Or you can use this URL: </span>
    <a href="${verificationLink}">${verificationLink}</a>
  </div>
    <div style="margin-top: 20px;">
      <span>If you did not create an account with DAWSON, please contact support at <a href="mailto:dawson.support@ustaxcourt.gov">dawson.support@ustaxcourt.gov</a>.</span>
    </div>
    <hr style="margin-top: 20px; border-top:1px solid #000000;">
    <div style="margin-top: 20px;">
      <span>This is an automated email. We are unable to respond to any messages to this email address.</span>
    </div>
  </div>`;

  await applicationContext
    .getMessageGateway()
    .sendEmailToUser(applicationContext, {
      body: emailBody,
      subject: 'U.S. Tax Court DAWSON: Account Verification',
      to: email,
    });

  return { confirmationCode: code };
}
