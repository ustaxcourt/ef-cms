import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { confirmAuthCodeCognitoLocal } from './confirmAuthCodeCognitoLocal';
import { sign } from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('confirmAuthCodeCognitoLocal', () => {
  const AuthenticationResult = {
    IdToken: '123',
  };
  const loginInfo = {
    code: 'userName',
    password: 'password',
  };

  beforeAll(() => {
    applicationContext.getCognito().initiateAuth.mockReturnValue({
      promise: () => {
        return { AuthenticationResult };
      },
    });
  });

  it('returns a token with the login if login is valid', async () => {
    await confirmAuthCodeCognitoLocal({
      applicationContext,
      code: 'docketclerk1@example.com',
    });

    expect(sign).toHaveBeenCalled();

    expect(sign.mock.calls[0][0]).toEqual({
      'custom:role': 'docketclerk',
      email: 'docketclerk1@example.com',
      name: 'Test Docketclerk1',
      sub: '2805d1ab-18d0-43ec-bafb-654e83405416',
      userId: '2805d1ab-18d0-43ec-bafb-654e83405416',
    });
  });

  it('returns an alertError when the login is invalid', async () => {
    applicationContext.getCognito().initiateAuth.mockReturnValueOnce({
      promise: () => {
        throw new Error('User not authorized.');
      },
    });
    const result = await confirmAuthCodeCognitoLocal({
      applicationContext,
      code: 'not a valid login',
    });

    expect(result).toMatchObject({
      alertError: {
        message: 'User not authorized.',
        title: 'User not authorized.',
      },
    });
  });

  it('calls cognitoLocal initiateAuth when user is not found in usermap', async () => {
    const result = await confirmAuthCodeCognitoLocal({
      applicationContext,
      ...loginInfo,
    });
    expect(applicationContext.getCognito().initiateAuth).toHaveBeenCalled();
    expect(result).toMatchObject({
      refreshToken: '123',
      token: '123',
    });
  });

  it('returns an alert with authentication challenge information when password must be reset', async () => {
    applicationContext.getCognito().initiateAuth.mockReturnValueOnce({
      promise: () => {
        return {
          ChallengeName: 'NEW_PASSWORD_REQUIRED',
          Session: 'abc123',
        };
      },
    });

    const result = await confirmAuthCodeCognitoLocal({
      applicationContext,
      ...loginInfo,
    });
    expect(applicationContext.getCognito().initiateAuth).toHaveBeenCalled();
    expect(result).toMatchObject({
      alertError: {
        message: 'NEW_PASSWORD_REQUIRED',
        sessionId: 'abc123',
        title: 'NEW_PASSWORD_REQUIRED',
      },
    });
  });
});
