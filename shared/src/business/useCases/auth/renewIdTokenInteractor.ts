import { NotAuthorizedException } from '@aws-sdk/client-cognito-identity-provider';
import { UnauthorizedError } from '@web-api/errors/errors';

export const renewIdTokenInteractor = async (
  applicationContext: IApplicationContext,
  { refreshToken }: { refreshToken: string },
): Promise<{
  idToken: string;
}> => {
  try {
    const { idToken } = await applicationContext
      .getPersistenceGateway()
      .renewIdToken(applicationContext, { refreshToken });

    return {
      idToken,
    };
  } catch (err) {
    if (err instanceof NotAuthorizedException) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    throw err;
  }
};
