import { confirmAuthCodeLocal } from './confirmAuthCodeLocal';
import { sign } from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('testing confirmAuthCodeLocal', () => {
  it('returns a token with the login if login is valid', () => {
    confirmAuthCodeLocal({
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

  it('returns an alertError when the login is invalid', () => {
    const result = confirmAuthCodeLocal({
      code: 'not a valid login',
    });

    expect(result).toMatchObject({
      alertError: {
        message: 'Login credentials not found.',
        title: 'Login error!',
      },
    });
  });
});
