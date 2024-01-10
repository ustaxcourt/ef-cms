import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError, UnknownUserError } from '@web-api/errors/errors';
import qs from 'qs';

export const loginInteractor = async (
  applicationContext: ServerApplicationContext,
  { email, password }: { email: string; password: string },
): Promise<{ idToken: string; accessToken: string; refreshToken: string }> => {
  try {
    const result = await applicationContext.getCognito().initiateAuth({
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        PASSWORD: password,
        USERNAME: email,
      },
      ClientId: applicationContext.environment.cognitoClientId,
    });

    return {
      accessToken: result.AuthenticationResult!.AccessToken!,
      idToken: result.AuthenticationResult!.IdToken!,
      refreshToken: result.AuthenticationResult!.RefreshToken!,
    };
  } catch (err: any) {
    console.log('*** api err', err);
    if (
      err.name === 'InvalidPasswordException' ||
      err.name === 'NotAuthorizedException'
    ) {
      throw new UnknownUserError('Invalid Username or Password');
    }

    if (err.name === 'UserNotConfirmedException') {
      await resendAccountConfirmation(applicationContext, email);

      throw new UnauthorizedError('User is unconfirmed');
    }

    throw err;
  }
};

async function resendAccountConfirmation(
  applicationContext: ServerApplicationContext,
  email: string,
): Promise<string> {
  const cognito = applicationContext.getCognito();

  const users = await cognito.listUsers({
    AttributesToGet: ['sub'],
    Filter: `email = "${email}"`,
    UserPoolId: process.env.USER_POOL_ID,
  });
  console.log(
    '*** user',
    users.Users?.[0],
    JSON.stringify(users.Users?.[0].Attributes?.[0].Value),
  );

  const userId = users.Users?.[0].Attributes?.[0].Value!;

  const accountConfirmationRecord = await applicationContext
    .getPersistenceGateway()
    .getAccountConfirmationCode(applicationContext, { userId });

  console.log('*** accountConfirmationRecord', accountConfirmationRecord);

  let newConfirmationCode = accountConfirmationRecord.confirmationCode;

  // if doesn't exist regenerate new confirmation code
  if (!newConfirmationCode) {
    console.log('*** generate new confirmation code');
    const { confirmationCode } = await applicationContext
      .getPersistenceGateway()
      .generateAccountConfirmationCode(applicationContext, { userId });
    newConfirmationCode = confirmationCode;
  }

  // Assume exists and resend confirmation email
  console.log('*** sending confirmation cod email');

  const queryString = qs.stringify(
    { confirmationCode: newConfirmationCode, userId },
    { encode: false },
  );

  const verificationLink = `https://app.${process.env.EFCMS_DOMAIN}/confirm-signup?${queryString}`;

  const emailBody =
    'Welcome to DAWSON! Your account with DAWSON has been created. Use the' +
    ' button below to verify your email address.' +
    `<button style="font-family: Source Sans Pro Web,Helvetica Neue,Helvetica,Roboto,Arial,sans-serif;
        font-size: 1.06rem;
        line-height: .9;
        color: #fff;
        background-color: #005ea2;
        border: 0;
        border-radius: 0.25rem;
        cursor: pointer;
        display: inline-block;
        margin-right: 0.5rem;
        padding: .75rem 2.25rem;
        text-align: center;
        text-decoration: none;"><a href="${verificationLink}">Verify Email</a></button>` +
    '<br><br><br>If you did not create an account with DAWSON, please contact support at ' +
    '<a href="mailto:dawson.support@ustaxcourt.gov">dawson.support@ustaxcourt.gov</a>.';

  return await applicationContext
    .getMessageGateway()
    .sendEmailToUser(applicationContext, {
      body: emailBody,
      subject: 'U.S. Tax Court DAWSON Account Verification',
      to: email,
    });
}
