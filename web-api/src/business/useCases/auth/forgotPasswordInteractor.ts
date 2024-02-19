import {
  AdminCreateUserCommandInput,
  CognitoIdentityProvider,
  UserStatusType,
} from '@aws-sdk/client-cognito-identity-provider';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import qs from 'qs';

export const forgotPasswordInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    email,
  }: {
    email: string;
  },
): Promise<void> => {
  const cognito: CognitoIdentityProvider = applicationContext.getCognito();

  const user = await applicationContext
    .getUserGateway()
    .getUserByEmail(applicationContext, { email });

  if (!user) {
    return;
  }

  if (user.accountStatus === UserStatusType.UNCONFIRMED) {
    await applicationContext
      .getUseCaseHelpers()
      .createUserConfirmation(applicationContext, {
        email,
        userId: user.userId,
      });

    throw new UnauthorizedError('User is unconfirmed'); //403
  }

  if (user.accountStatus === UserStatusType.FORCE_CHANGE_PASSWORD) {
    const input: AdminCreateUserCommandInput = {
      DesiredDeliveryMediums: ['EMAIL'],
      MessageAction: 'RESEND',
      UserPoolId: applicationContext.environment.userPoolId,
      Username: email,
    };

    if (process.env.STAGE !== 'prod') {
      input.TemporaryPassword = process.env.DEFAULT_ACCOUNT_PASS;
    }

    await cognito.adminCreateUser(input);
    throw new UnauthorizedError('User is unconfirmed'); //403
  }

  const { code } = await applicationContext
    .getPersistenceGateway()
    .generateForgotPasswordCode(applicationContext, { userId: user.userId });

  const queryString = qs.stringify({ code, email }, { encode: true });
  const verificationLink = `https://app.${process.env.EFCMS_DOMAIN}/reset-password?${queryString}`;

  const emailBody = `<div>
    <h3>Welcome to DAWSON!</h3>
    <span>
      ${email} requested a password reset. Use the button below to reset your password. <span style="font-weight: bold;">This will expire in 24 hours</span>.
    </span>
    <div style="margin-top: 20px;">
      <a href="${verificationLink}" style="background-color: #005ea2; color: white; line-height: 0.9; border-radius: 0.25rem; text-decoration: none; font-size: 1.06rem; padding: .6rem 2.25rem; font-family: Source Sans Pro Web,Helvetica Neue,Helvetica,Roboto,Arial,sans-serif;">Reset Password</a>
    </div>
    <div style="margin-top: 20px;">
      <span>Or you can use this URL: </span>
      <a href="${verificationLink}">${verificationLink}</a>
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
};
