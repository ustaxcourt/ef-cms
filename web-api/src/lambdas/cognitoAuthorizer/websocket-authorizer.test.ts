import { handler } from './websocket-authorizer';
import axios from 'axios';
import jwk from 'jsonwebtoken';

const mockLogger = {
  addContext: jest.fn(),
  clearContext: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
};
jest.mock('@web-api/utilities/logger/getLogger', () => {
  return {
    getLogger: () => mockLogger,
  };
});
jest.mock('jsonwebtoken', () => {
  return {
    decode: jest.fn(),
    verify: jest.fn(),
  };
});
jest.mock('crypto', () => {
  return {
    createPublicKey: jest.fn().mockImplementation(() => ({
      export: jest.fn().mockReturnValue({
        toString: jest.fn().mockReturnValue('test-pem'),
      }),
    })),
  };
});

describe('websocket-authorizer', () => {
  const TOKEN_VALUE =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWlzc2lvbnNjbGVya0BleGFtcGxlLmNvbSIsIm5hbWUiOiJUZXN0IEFkbWlzc2lvbnMgQ2xlcmsiLCJyb2xlIjoiYWRtaXNzaW9uc2NsZXJrIiwic2VjdGlvbiI6ImFkbWlzc2lvbnMiLCJ1c2VySWQiOiI5ZDdkNjNiNy1kN2E1LTQ5MDUtYmE4OS1lZjcxYmYzMDA1N2YiLCJjdXN0b206cm9sZSI6ImFkbWlzc2lvbnNjbGVyayIsInN1YiI6IjlkN2Q2M2I3LWQ3YTUtNDkwNS1iYTg5LWVmNzFiZjMwMDU3ZiIsImlhdCI6MTYwOTQ0NTUyNn0.kow3pAUloDseD3isrxgtKBpcKsjMktbRBzY41c1NRqA';

  const setupHappyPath = verifyObject => {
    axios.get.mockImplementation(() => {
      return Promise.resolve({
        data: { keys: [{ kid: 'key-identifier' }] },
      });
    });

    jwk.verify.mockImplementation((token, pem, options, callback) => {
      if (token !== TOKEN_VALUE || pem !== 'test-pem') {
        throw new Error('wrong token or pem was passed to verification');
      }

      expect(options.issuer).toBeDefined();
      callback(null, verifyObject);
    });
  };

  let event, context;

  beforeEach(() => {
    event = {
      methodArn:
        'arn:aws:execute-api:us-east-1:aws-account-id:api-gateway-id/stage/GET/path',
      queryStringParameters: {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWlzc2lvbnNjbGVya0BleGFtcGxlLmNvbSIsIm5hbWUiOiJUZXN0IEFkbWlzc2lvbnMgQ2xlcmsiLCJyb2xlIjoiYWRtaXNzaW9uc2NsZXJrIiwic2VjdGlvbiI6ImFkbWlzc2lvbnMiLCJ1c2VySWQiOiI5ZDdkNjNiNy1kN2E1LTQ5MDUtYmE4OS1lZjcxYmYzMDA1N2YiLCJjdXN0b206cm9sZSI6ImFkbWlzc2lvbnNjbGVyayIsInN1YiI6IjlkN2Q2M2I3LWQ3YTUtNDkwNS1iYTg5LWVmNzFiZjMwMDU3ZiIsImlhdCI6MTYwOTQ0NTUyNn0.kow3pAUloDseD3isrxgtKBpcKsjMktbRBzY41c1NRqA',
      },
      type: 'TOKEN',
    };

    context = {
      awsRequestId: 'request-id',
      logLevel: 'debug',
    };

    jest.spyOn(axios, 'get');

    jwk.decode.mockReturnValue({
      header: { kid: 'key-identifier' },
      payload: { iss: `issuer-url-${Math.random()}` },
    });
  });

  it('returns unauthorized when token is missing', async () => {
    event.queryStringParameters = null;

    await expect(() => handler(event, context)).rejects.toThrow('Unauthorized');

    expect(mockLogger.info).toHaveBeenCalledWith(
      'No authorizationToken found in the header',
    );
  });

  it('returns unauthorized if there is an error in contacting the issuer', async () => {
    axios.get.mockImplementation(() => {
      throw new Error('any error');
    });

    await expect(() => handler(event, context)).rejects.toThrow('Unauthorized');

    expect(mockLogger.warn).toHaveBeenCalledWith(
      'Could not fetch keys for token issuer, considering request unauthorized',
      new Error('any error'),
    );
  });

  it('returns unauthorized if the issuer doesn’t return data in expected format', async () => {
    axios.get.mockImplementation(() => {
      return Promise.resolve({ data: null });
    });

    await expect(() => handler(event, context)).rejects.toThrow('Unauthorized');

    expect(mockLogger.warn).toHaveBeenCalledWith(
      'Could not fetch keys for token issuer, considering request unauthorized',
      expect.anything(),
    );
  });

  it('returns unauthorized if issuer is not the cognito user pools', async () => {
    axios.get.mockImplementation(() => {
      return Promise.resolve({
        data: { keys: [{ kid: 'not-expected-key-identifier' }] },
      });
    });

    await expect(() => handler(event, context)).rejects.toThrow('Unauthorized');

    expect(mockLogger.warn).toHaveBeenCalledWith(
      'The key used to sign the authorization token was not found in the user pool’s keys, considering request unauthorized',
      expect.objectContaining({
        issuer: expect.any(String),
        keys: expect.any(Array),
        requestedKeyId: 'key-identifier',
      }),
    );
  });

  it('returns unauthorized if token is not verified', async () => {
    axios.get.mockImplementation(() => {
      return Promise.resolve({
        data: { keys: [{ kid: 'key-identifier' }] },
      });
    });

    jwk.verify.mockImplementation((token, pem, options, callback) => {
      if (token !== TOKEN_VALUE || pem !== 'test-pem') {
        throw new Error('wrong token or pem was passed to verification');
      }

      expect(options.issuer).toBeDefined();
      callback(new Error('verification failed'));
    });

    await expect(() => handler(event, context)).rejects.toThrow('Unauthorized');

    expect(mockLogger.warn).toHaveBeenCalledWith(
      'The token is not valid, considering request unauthorized',
      expect.anything(),
    );
  });

  it('returns IAM policy to allow invoking requested lambda when authorized', async () => {
    setupHappyPath({ 'custom:userId': 'test-custom:userId' });

    const policy = await handler(event, context);

    expect(policy).toStrictEqual(
      expect.objectContaining({
        policyDocument: {
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: 'Allow',
              Resource:
                'arn:aws:execute-api:us-east-1:aws-account-id:api-gateway-id/stage/*',
            },
          ],
          Version: '2012-10-17',
        },
        principalId: 'test-custom:userId',
      }),
    );

    expect(mockLogger.info).toHaveBeenCalledWith('Request authorized', {
      metadata: { policy },
    });
  });

  it('returns IAM policy to allow invoking requested lambda when authorized using the payload custom:userId', async () => {
    setupHappyPath({ 'custom:userId': 'test-custom:userId' });

    const policy = await handler(event, context);

    expect(policy).toStrictEqual(
      expect.objectContaining({
        policyDocument: {
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: 'Allow',
              Resource:
                'arn:aws:execute-api:us-east-1:aws-account-id:api-gateway-id/stage/*',
            },
          ],
          Version: '2012-10-17',
        },
        principalId: 'test-custom:userId',
      }),
    );

    expect(mockLogger.info).toHaveBeenCalledWith('Request authorized', {
      metadata: { policy },
    });
  });

  it('caches keys for issuers', async () => {
    jest.spyOn(jwk, 'decode').mockImplementation(() => {
      return {
        header: { kid: 'identifier-to-cache' },
        payload: { iss: 'issuer-url' },
      };
    });

    axios.get.mockImplementation(() => {
      return Promise.resolve({
        data: { keys: [{ kid: 'identifier-to-cache' }] },
      });
    });

    jwk.verify.mockImplementation((token, pem, options, callback) => {
      callback(null, { 'custom:userId': 'test-custom:userId' });
    });

    await handler(event, context);

    // First call is not cached
    expect(axios.get).toHaveBeenCalledTimes(1);

    await handler(event, context);

    // Second call is cached
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  it('should throw an unauthorized error if there was an issue decoding the token', async () => {
    jest.spyOn(jwk, 'decode').mockImplementation(() => {
      throw new Error();
    });
    await expect(() => handler(event, context)).rejects.toThrow('Unauthorized');
  });

  it('should throw an unauthorized error if there are issues getting the token from the event', async () => {
    event = new Proxy(
      { queryStringParameters: null },
      {
        get() {
          throw new Error();
        },
      },
    );
    await expect(() => handler(event, context)).rejects.toThrow('Unauthorized');
  });

  it('should return a policy if the token is provided in the query string', async () => {
    setupHappyPath({ 'custom:userId': 'test-custom:userId' });

    event = {
      methodArn: 'a/b/c',
      queryStringParameters: {
        token: TOKEN_VALUE,
      },
    };
    const policy = await handler(event, context);
    expect(policy).toBeDefined();
  });
});
