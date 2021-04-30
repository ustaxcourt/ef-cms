const { getClientId } = require('./getClientId');
jest.mock('aws-sdk');
const aws = require('aws-sdk');

describe('getClientId', () => {
  const mockUserPoolId = 'us-east-1_Gg5RM8fn';

  const expectedClientId = '82b35e7c-9830-4104-bb15-24a2eda7f84e';
  aws.CognitoIdentityServiceProvider = jest.fn().mockReturnValue({
    listUserPoolClients: jest.fn().mockReturnValue({
      promise: async () => ({
        UserPoolClients: [{ ClientId: expectedClientId }],
      }),
    }),
  });

  it('returns the first clientId from the list of user pool clients', async () => {
    const result = await getClientId({
      userPoolId: mockUserPoolId,
    });

    expect(result).toEqual(expectedClientId);
  });
});
