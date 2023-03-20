const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { confirmAuthCode } = require('./confirmAuthCode');

jest.mock('aws-sdk');
const aws = require('aws-sdk');

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
    aws.CognitoIdentityServiceProvider = jest.fn().mockReturnValue({
      listUserPoolClients: jest.fn().mockReturnValue({
        promise: () =>
          Promise.resolve({
            UserPoolClients: [{ ClientId: expectedClientId }],
          }),
      }),
    });

    applicationContext.getHttpClient = () => mockAxios;
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
