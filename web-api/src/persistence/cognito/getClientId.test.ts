import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { getClientId } from './getClientId';

jest.mock('@aws-sdk/client-cognito-identity-provider');

describe('getClientId', () => {
  const mockUserPoolId = 'us-east-1_Gg5RM8fn';

  const expectedClientId = '82b35e7c-9830-4104-bb15-24a2eda7f84e';
  (CognitoIdentityProvider as jest.Mock).mockReturnValue({
    listUserPoolClients: jest.fn().mockResolvedValue({
      UserPoolClients: [{ ClientId: expectedClientId }],
    }),
  });

  it('returns the first clientId from the list of user pool clients', async () => {
    const result = await getClientId({
      userPoolId: mockUserPoolId,
    });

    expect(result).toEqual(expectedClientId);
  });
});
