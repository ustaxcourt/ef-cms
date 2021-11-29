import { requestTokensFromParentTab } from './requestTokensFromParentTab';

describe('requestTokensFromParentTab', () => {
  it('returns true if the token was received in 1 second', async () => {
    const mockBroadcastGateway = {
      onmessage: () => null,
      postMessage: jest.fn(),
    };
    const mockApplicationContext = {
      getBroadcastGateway: () => mockBroadcastGateway,
      getUseCases: () => ({
        getUserInteractor: jest.fn(),
      }),
      setCurrentUser: jest.fn(),
      setCurrentUserToken: jest.fn(),
    };

    const promise = requestTokensFromParentTab({
      applicationContext: mockApplicationContext,
      presenter: {
        state: {},
      },
    });
    mockBroadcastGateway.onmessage({
      refreshToken: 'abc',
      subject: 'receiveToken',
      token: '123',
    });
    const result = await promise;
    expect(result).toBeTruthy();
  });

  it('returns false if token was never received within 1 second', async () => {
    const mockBroadcastGateway = {
      onmessage: () => null,
      postMessage: jest.fn(),
    };
    const mockApplicationContext = {
      getBroadcastGateway: () => mockBroadcastGateway,
      getUseCases: () => ({
        getUserInteractor: jest.fn(),
      }),
      setCurrentUser: jest.fn(),
      setCurrentUserToken: jest.fn(),
    };
    let href = '';

    const result = await requestTokensFromParentTab({
      applicationContext: mockApplicationContext,
      presenter: {
        state: {
          cognitoLoginUrl: 'http://example.com',
        },
      },
      redirect: url => (href = url),
    });
    expect(result).toBeFalsy();
    expect(href).toEqual('http://example.com');
  });
});
