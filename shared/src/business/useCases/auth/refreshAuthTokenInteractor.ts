import { AWSError } from 'aws-sdk';
import { UnauthorizedError } from '@web-api/errors/errors';

export const refreshAuthTokenInteractor = async (
  applicationContext: IApplicationContext,
  { refreshToken }: { refreshToken: string },
): Promise<{
  token: string;
}> => {
  try {
    const { token } = await applicationContext
      .getPersistenceGateway()
      .renewIdToken(applicationContext, { refreshToken });

    return {
      token,
    };
  } catch (err) {
    if ((err as AWSError).code === 'NotAuthorizedException') {
      throw new UnauthorizedError('Invalid refresh token');
    }

    throw err;
  }
};
