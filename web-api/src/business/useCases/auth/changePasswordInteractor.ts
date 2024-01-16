import { RespondToAuthChallengeCommandInput } from '@aws-sdk/client-cognito-identity-provider';
import { ServerApplicationContext } from '@web-api/applicationContext';
import {
  UnauthorizedError,
  UnidentifiedUserError,
} from '@web-api/errors/errors';

export const changePasswordInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    confirmPassword,
    password,
    tempPassword,
    userEmail,
  }: {
    password: string;
    tempPassword: string;
    userEmail: string;
    confirmPassword: string;
  },
) => {
  try {
    // TODO: Validate Password === ConfirmPassword + Rules?
    console.log('confirmPassword', confirmPassword);

    const initiateAuthResult = await applicationContext
      .getCognito()
      .initiateAuth({
        AuthFlow: 'USER_PASSWORD_AUTH',
        AuthParameters: {
          PASSWORD: tempPassword,
          USERNAME: userEmail,
        },
        ClientId: applicationContext.environment.cognitoClientId,
      });

    if (initiateAuthResult?.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
      const params: RespondToAuthChallengeCommandInput = {
        ChallengeName: 'NEW_PASSWORD_REQUIRED',
        ChallengeResponses: {
          NEW_PASSWORD: password,
          USERNAME: userEmail,
        },
        ClientId: process.env.COGNITO_CLIENT_ID,
        Session: initiateAuthResult.Session,
      };

      const cognito = applicationContext.getCognito();
      const result = await cognito.respondToAuthChallenge(params);

      return {
        accessToken: result.AuthenticationResult!.AccessToken!,
        idToken: result.AuthenticationResult!.IdToken!,
        refreshToken: result.AuthenticationResult!.RefreshToken!,
      };
    }

    throw new Error('Something went wrong while changing passwords... :(');
  } catch (err: any) {
    console.log('changePasswordInteractorError', err);

    if (
      err.name === 'InvalidPasswordException' ||
      err.name === 'NotAuthorizedException' ||
      err.name === 'UserNotFoundException'
    ) {
      throw new UnidentifiedUserError('Invalid Username or Password'); //401
    }

    if (err.name === 'UserNotConfirmedException') {
      throw new UnauthorizedError('User is unconfirmed'); //403
    }

    throw err;
  }
};
