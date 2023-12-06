import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { confirmAuthCode } from './confirmAuthCode';

jest.mock('@aws-sdk/client-cognito-identity-provider');

describe('confirmAuthCode', () => {
  const mockAxios = {
    post: jest.fn().mockReturnValue({
      data: {
        id_token: '123',
        refresh_token: 'abc',
      },
    }),
  };

  beforeEach(() => {
    const expectedClientId = '82b35e7c-9830-4104-bb15-24a2eda7f84e';
    (CognitoIdentityProvider as jest.Mock).mockReturnValue({
      listUserPoolClients: jest.fn().mockReturnValue({
        promise: () =>
          Promise.resolve({
            UserPoolClients: [{ ClientId: expectedClientId }],
          }),
      }),
    });

    (applicationContext as any).getHttpClient = () => mockAxios;
  });

  it('returns the first clientId from the list of user pool clients', async () => {
    const result = await confirmAuthCode({ applicationContext, code: 'abc' });

    expect(mockAxios.post).toHaveBeenCalled();

    expect(result).toEqual({
      refreshToken: 'abc',
      token: '123',
    });
  });
});
