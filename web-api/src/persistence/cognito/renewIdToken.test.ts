import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { renewIdToken } from './renewIdToken';

jest.mock('@aws-sdk/client-cognito-identity-provider');

describe('renewIdToken', () => {
  const expectedToken = '123';
  const mockAxios = {
    post: jest.fn().mockReturnValue({
      data: {
        id_token: expectedToken,
      },
    }),
  };

  beforeEach(() => {
    const expectedClientId = '82b35e7c-9830-4104-bb15-24a2eda7f84e';
    (CognitoIdentityProvider as jest.Mock).mockReturnValue({
      listUserPoolClients: jest.fn().mockResolvedValue({
        UserPoolClients: [{ ClientId: expectedClientId }],
      }),
    });

    (applicationContext as any).getHttpClient = () => mockAxios;
  });

  it('returns the first clientId from the list of user pool clients', async () => {
    const result = await renewIdToken(applicationContext, {
      refreshToken: 'abc',
    });

    expect(mockAxios.post).toHaveBeenCalled();

    expect(result).toEqual({
      token: expectedToken,
    });
  });
});
