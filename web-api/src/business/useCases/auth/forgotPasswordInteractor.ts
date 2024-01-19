import { ServerApplicationContext } from '@web-api/applicationContext';
import qs from 'qs';

export type ForgotPasswordResponse = {
  email: string;
  userId?: string;
  code?: string;
};

export const forgotPasswordInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    email,
  }: {
    email: string;
  },
): Promise<ForgotPasswordResponse> => {
  // Put forgot_pass code in dynamo
  const cognito = applicationContext.getCognito();

  const users = await cognito.listUsers({
    AttributesToGet: ['custom:userId'],
    Filter: `email = "${email}"`,
    UserPoolId: process.env.USER_POOL_ID,
  });

  const userId = users.Users?.[0].Attributes?.find(
    element => element.Name === 'custom:userId',
  )?.Value;

  if (!userId) {
    console.log('Could not find an account for email: ', email);
    return { email };
  }

  const { code } = await applicationContext
    .getPersistenceGateway()
    .generateForgotPasswordCode(applicationContext, { userId });

  console.log('**** code is : ', code);

  const queryString = qs.stringify({ code, email, userId }, { encode: false });
  const verificationLink = `https://app.${process.env.EFCMS_DOMAIN}/reset-password?${queryString}`;

  const emailBody = `<div>
    <h3>Welcome to DAWSON!</h3>
    <span>
      ${email} requested a password reset. Use the button below to reset your password. <span style="font-weight: bold;">This will expire in 24 hours</span>.
    </span>
    <div style="margin-top: 20px;">
      <a href="${verificationLink}" style="background-color: #005ea2; color: white; line-height: 0.9; border-radius: 0.25rem; text-decoration: none; font-size: 1.06rem; padding: .6rem 2.25rem; font-family: Source Sans Pro Web,Helvetica Neue,Helvetica,Roboto,Arial,sans-serif;">Verify Email</a>
    </div>
    <div style="margin-top: 20px;">
      <span>Or you can use this URL: </span>
      <span>SOME URL GOES HERE</span>
    </div>
    <div style="margin-top: 20px;">
    <span>If you did not request to reset your password, contact <a href="mailto:dawson.support@ustaxcourt.gov">dawson.support@ustaxcourt.gov</a>.</span>
    </div>

    <hr style="border-top:1px solid #000000;">
    <div style="margin-top: 20px;">
      <span>This is an automated email. We are unable to respond to any messages to this email address.</span>
    </div>
  </div>`;

  await applicationContext
    .getMessageGateway()
    .sendEmailToUser(applicationContext, {
      body: emailBody,
      subject: 'U.S. Tax Court DAWSON Account Verification',
      to: email,
    });

  const forgotPasswordResponse: ForgotPasswordResponse = {
    email,
  };

  // Only return code & userId locally as we cannot send an email. Do not expose code & userId in deployed env.
  if (applicationContext.environment.stage === 'local') {
    forgotPasswordResponse.code = code;
    forgotPasswordResponse.userId = userId;
  }

  return forgotPasswordResponse;
};
