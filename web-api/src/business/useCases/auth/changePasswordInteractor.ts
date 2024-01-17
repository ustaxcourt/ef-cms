import { ChangePasswordForm } from '@shared/business/entities/ChangePasswordForm';
import { InvalidEntityError } from '@web-api/errors/errors';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { authErrorHandling } from '@web-api/business/useCases/auth/loginInteractor';
import jwt from 'jsonwebtoken';

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
    const errors = new ChangePasswordForm({
      confirmPassword,
      password,
      userEmail,
    }).getFormattedValidationErrors();
    if (errors) {
      throw new InvalidEntityError('Change Password Form Entity is invalid');
    }

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
      const result = await applicationContext
        .getCognito()
        .respondToAuthChallenge({
          ChallengeName: 'NEW_PASSWORD_REQUIRED',
          ChallengeResponses: {
            NEW_PASSWORD: password,
            USERNAME: userEmail,
          },
          ClientId: process.env.COGNITO_CLIENT_ID,
          Session: initiateAuthResult.Session,
        });

      if (
        !result.AuthenticationResult?.AccessToken ||
        !result.AuthenticationResult?.IdToken ||
        !result.AuthenticationResult?.RefreshToken
      ) {
        throw new Error('Unsuccessful change password');
      }

      const decoded = jwt.decode(result.AuthenticationResult?.IdToken);
      const userId = decoded['custom:userId'] || decoded.sub;

      const userFromPersistence = await applicationContext
        .getPersistenceGateway()
        .getUserById({ applicationContext, userId });

      if (
        userFromPersistence &&
        userFromPersistence.pendingEmail &&
        userFromPersistence.pendingEmail === userEmail
      ) {
        const updatedUser = await applicationContext
          .getUseCases()
          .setUserEmailFromPendingEmailInteractor(applicationContext, {
            user: userFromPersistence,
          });

        applicationContext.logger.info(
          'Petitioner post authentication processed',
          {
            updatedUser,
          },
        );
      }

      return {
        accessToken: result.AuthenticationResult.AccessToken,
        idToken: result.AuthenticationResult.IdToken,
        refreshToken: result.AuthenticationResult.RefreshToken,
      };
    }

    throw new Error('User is not `FORCE_CHANGE_PASSWORD` state');
  } catch (err: any) {
    await authErrorHandling(applicationContext, {
      email: userEmail,
      error: err,
      sendAccountConfirmation: false,
    });
    throw err;
  }
};
