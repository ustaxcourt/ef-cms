import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownUserError } from '@web-api/errors/errors';
import { sendAccountCreationConfirmation } from '@web-api/business/useCases/auth/signUpUserInteractor';

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
      await sendAccountCreationConfirmation(applicationContext, {
        confirmationCode: newConfirmationCode!,
        email,
        userId,
      });
    }

    throw err;
  }
};
