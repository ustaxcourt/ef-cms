import { applicationContext } from '../../business/test/createTestApplicationContext';
import { confirmAuthCode } from './confirmAuthCode';

jest.mock('aws-sdk');
import aws from 'aws-sdk';

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
