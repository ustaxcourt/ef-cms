// import { RespondToAuthChallengeCommandInput } from '@aws-sdk/client-cognito-identity-provider';
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
): Promise<{ idToken: string; accessToken: string; refreshToken: string }> => {
  try {
    // TODO: Validate Password === ConfirmPassword + Rules?
    // TODO: If we decide to stick with adminUserSetPassword, remove tempPassword everywhere
    console.log('confirmPassword', confirmPassword);
    console.log('tempPassword', tempPassword);
    const setPasswordResult = await applicationContext
      .getCognito()
      .adminSetUserPassword({
        Password: password,
        Permanent: true,
        UserPoolId: process.env.USER_POOL_ID,
        Username: userEmail,
      });

    console.log('setPasswordResult****', setPasswordResult);

    if (setPasswordResult.$metadata.httpStatusCode === 200) {
      const initiateAuthResult = await applicationContext
        .getCognito()
        .initiateAuth({
          AuthFlow: 'USER_PASSWORD_AUTH',
          AuthParameters: {
            PASSWORD: password,
            USERNAME: userEmail,
          },
          ClientId: applicationContext.environment.cognitoClientId,
        });

      console.log('initiateAuthResult****', initiateAuthResult);
      return {
        accessToken: initiateAuthResult.AuthenticationResult!.AccessToken!,
        idToken: initiateAuthResult.AuthenticationResult!.IdToken!,
        refreshToken: initiateAuthResult.AuthenticationResult!.RefreshToken!,
      };
    }
    throw new Error('Could not set user password');
    // const initiateAuthResult = await applicationContext
    //   .getCognito()
    //   .initiateAuth({
    //     AuthFlow: 'USER_PASSWORD_AUTH',
    //     AuthParameters: {
    //       PASSWORD: tempPassword,
    //       USERNAME: userEmail,
    //     },
    //     ClientId: applicationContext.environment.cognitoClientId,
    //   });

    // if (initiateAuthResult?.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
    //   const params: RespondToAuthChallengeCommandInput = {
    //     ChallengeName: 'NEW_PASSWORD_REQUIRED',
    //     ChallengeResponses: {
    //       NEW_PASSWORD: password,
    //       USERNAME: userEmail,
    //     },
    //     ClientId: process.env.COGNITO_CLIENT_ID,
    //     Session: initiateAuthResult.Session,
    //   };

    //   const cognito = applicationContext.getCognito();
    //   const result = await cognito.respondToAuthChallenge(params);

    //   return {
    //     accessToken: result.AuthenticationResult!.AccessToken!,
    //     idToken: result.AuthenticationResult!.IdToken!,
    //     refreshToken: result.AuthenticationResult!.RefreshToken!,
    //   };
    // }

    // throw new Error('Something went wrong while changing passwords... :(');
  } catch (err: any) {
    console.log('changePasswordInteractorError***', err);

    if (
      err.name === 'InvalidPasswordException' ||
      err.name === 'NotAuthorizedException' ||
      err.name === 'UserNotFoundException' ||
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
