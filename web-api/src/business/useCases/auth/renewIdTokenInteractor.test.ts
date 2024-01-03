import { NotAuthorizedException } from '@aws-sdk/client-cognito-identity-provider';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { renewIdTokenInteractor } from './renewIdTokenInteractor';

describe('renewIdTokenInteractor', () => {
  it('should throw an UnauthorizedError when the id token cannot be renewed because the refresh token has expired', async () => {
    const mockError = new NotAuthorizedException({
      $metadata: {},
      message: 'Refresh token is expired',
    });
    applicationContext
      .getPersistenceGateway()
      .renewIdToken.mockRejectedValue(mockError);

    await expect(
      renewIdTokenInteractor(applicationContext, {
        refreshToken: undefined as any,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should make a call to get an id token and refresh token', async () => {
    const expectedRefresh = 'sometoken';
    applicationContext.getPersistenceGateway().renewIdToken.mockResolvedValue({
      idToken: 'abc',
    });

    const result = await renewIdTokenInteractor(applicationContext, {
      refreshToken: expectedRefresh,
    });

    expect(
      applicationContext.getPersistenceGateway().renewIdToken.mock.calls[0][1],
    ).toEqual({ refreshToken: expectedRefresh });
    expect(result).toEqual({
      idToken: 'abc',
    });
  });
});
