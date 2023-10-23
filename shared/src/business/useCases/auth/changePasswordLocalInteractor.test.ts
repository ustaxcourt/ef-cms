import { applicationContext } from '../../test/createTestApplicationContext';
import { changePasswordLocalInteractor } from './changePasswordLocalInteractor';

describe('changePasswordLocalInteractor', () => {
  const authenticationResult = {
    AccessToken: 'abc',
    IdToken: '123',
  };

  beforeEach(() => {
    applicationContext.getCognito().respondToAuthChallenge.mockReturnValue({
      promise: () => {
        return { AuthenticationResult: authenticationResult };
      },
    });
  });

  it('attempts to respond to cognito authentication challenge', async () => {
    const result = await changePasswordLocalInteractor(applicationContext, {
      newPassword: 'newPassword',
      sessionId: '1',
      userEmail: 'userEmail@example.com',
    });

    expect(
      applicationContext.getCognito().respondToAuthChallenge.mock.calls[0][0]
        .ChallengeResponses,
    ).toMatchObject({
      NEW_PASSWORD: 'newPassword',
      USERNAME: 'userEmail@example.com',
    });

    expect(result.AuthenticationResult).toEqual(authenticationResult);
  });
});
