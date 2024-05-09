import { createLogger } from '../../createLogger';
import { handler } from './cognito-authorizer';
import { transports } from 'winston';
import axios from 'axios';
import fs from 'fs';
import jwk from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
const { createLogger: actualCreateLogger } = jest.requireActual(
  '../../../src/createLogger',
);
jest.mock('jwk-to-pem', () => jest.fn());
jest.mock('../../../src/createLogger', () => {
  return { createLogger: jest.fn() };
});
jest.mock('jsonwebtoken', () => {
  return {
    decode: jest.fn(),
    verify: jest.fn(),
  };
});

describe('cognito-authorizer', () => {
  const TOKEN_VALUE =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWlzc2lvbnNjbGVya0BleGFtcGxlLmNvbSIsIm5hbWUiOiJUZXN0IEFkbWlzc2lvbnMgQ2xlcmsiLCJyb2xlIjoiYWRtaXNzaW9uc2NsZXJrIiwic2VjdGlvbiI6ImFkbWlzc2lvbnMiLCJ1c2VySWQiOiI5ZDdkNjNiNy1kN2E1LTQ5MDUtYmE4OS1lZjcxYmYzMDA1N2YiLCJjdXN0b206cm9sZSI6ImFkbWlzc2lvbnNjbGVyayIsInN1YiI6IjlkN2Q2M2I3LWQ3YTUtNDkwNS1iYTg5LWVmNzFiZjMwMDU3ZiIsImlhdCI6MTYwOTQ0NTUyNn0.kow3pAUloDseD3isrxgtKBpcKsjMktbRBzY41c1NRqA';

  const setupHappyPath = verifyObject => {
    (axios.get as jest.Mock).mockImplementation(() => {
      return Promise.resolve({
        data: { keys: [{ kid: 'key-identifier' }] },
      });
    });

    jwkToPem.mockImplementation(key => {
      if (key.kid !== 'key-identifier') {
        throw new Error('wrong key was given');
      }

      return 'test-pem';
    });

    jwk.verify.mockImplementation((token, pem, options, callback) => {
      if (token !== TOKEN_VALUE || pem !== 'test-pem') {
        throw new Error('wrong token or pem was passed to verification');
      }

      expect(options.issuer).toBeDefined();
      callback(null, verifyObject);
    });
  };

  let event, context, transport;

  beforeEach(() => {
    transport = new transports.Stream({
      stream: fs.createWriteStream('/dev/null'),
    });

    (createLogger as jest.Mock).mockImplementation(opts => {
      opts.transports = [transport];
      return actualCreateLogger(opts);
    });

    event = {
      authorizationToken:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWlzc2lvbnNjbGVya0BleGFtcGxlLmNvbSIsIm5hbWUiOiJUZXN0IEFkbWlzc2lvbnMgQ2xlcmsiLCJyb2xlIjoiYWRtaXNzaW9uc2NsZXJrIiwic2VjdGlvbiI6ImFkbWlzc2lvbnMiLCJ1c2VySWQiOiI5ZDdkNjNiNy1kN2E1LTQ5MDUtYmE4OS1lZjcxYmYzMDA1N2YiLCJjdXN0b206cm9sZSI6ImFkbWlzc2lvbnNjbGVyayIsInN1YiI6IjlkN2Q2M2I3LWQ3YTUtNDkwNS1iYTg5LWVmNzFiZjMwMDU3ZiIsImlhdCI6MTYwOTQ0NTUyNn0.kow3pAUloDseD3isrxgtKBpcKsjMktbRBzY41c1NRqA',
      methodArn:
        'arn:aws:execute-api:us-east-1:aws-account-id:api-gateway-id/stage/GET/path',
      type: 'TOKEN',
    };

    context = {
      awsRequestId: 'request-id',
      logLevel: 'debug',
    };

    jwk.decode.mockReturnValue({
      header: { kid: 'key-identifier' },
      payload: { iss: `issuer-url-${Math.random()}` },
    });

    jest.spyOn(axios, 'get');
    jest.spyOn(transport, 'log');
  });

  it('returns unauthorized when token is missing', async () => {
    event.authorizationToken = '';

    await expect(() => handler(event, context)).rejects.toThrow('Unauthorized');

    expect(transport.log).toHaveBeenCalledWith(
      expect.objectContaining({
        level: expect.stringContaining('info'),
        message: expect.stringContaining('No authorizationToken found'),
      }),
      expect.any(Function),
    );
  });

  it('returns unauthorized if there is an error in contacting the issuer', async () => {
    (axios.get as jest.Mock).mockImplementation(() => {
      throw new Error('any error');
    });

    await expect(() => handler(event, context)).rejects.toThrow('Unauthorized');

    expect(transport.log).toHaveBeenCalledWith(
      expect.objectContaining({
        level: expect.stringContaining('warning'),
        message: expect.stringContaining(
          'Could not fetch keys for token issuer',
        ),
        stack: expect.stringContaining('Error: any error'),
      }),
      expect.any(Function),
    );
  });

  it('returns unauthorized if the issuer doesn’t return data in expected format', async () => {
    (axios.get as jest.Mock).mockImplementation(() => {
      return Promise.resolve({ data: null });
    });

    await expect(() => handler(event, context)).rejects.toThrow('Unauthorized');

    expect(transport.log).toHaveBeenCalledWith(
      expect.objectContaining({
        level: expect.stringContaining('warning'),
        message: expect.stringContaining(
          'Could not fetch keys for token issuer',
        ),
        stack: expect.any(String),
      }),
      expect.any(Function),
    );
  });

  it('returns unauthorized if issuer is not the cognito user pools', async () => {
    (axios.get as jest.Mock).mockImplementation(() => {
      return Promise.resolve({
        data: { keys: [{ kid: 'not-expected-key-identifier' }] },
      });
    });

    await expect(() => handler(event, context)).rejects.toThrow('Unauthorized');

    expect(transport.log).toHaveBeenCalledWith(
      expect.objectContaining({
        issuer: expect.any(String),
        keys: expect.any(Array),
        level: expect.stringContaining('warning'),
        message: expect.stringContaining(
          'was not found in the user pool’s keys',
        ),
        requestedKeyId: 'key-identifier',
      }),
      expect.any(Function),
    );
  });

  it('returns unauthorized if token is not verified', async () => {
    (axios.get as jest.Mock).mockImplementation(() => {
      return Promise.resolve({
        data: { keys: [{ kid: 'key-identifier' }] },
      });
    });

    jwkToPem.mockImplementation(key => {
      if (key.kid !== 'key-identifier') {
        throw new Error('wrong key was given');
      }

      return 'test-pem';
    });

    jwk.verify.mockImplementation((token, pem, options, callback) => {
      if (token !== TOKEN_VALUE || pem !== 'test-pem') {
        throw new Error('wrong token or pem was passed to verification');
      }

      expect(options.issuer).toBeDefined();
      callback(new Error('verification failed'));
    });

    await expect(() => handler(event, context)).rejects.toThrow('Unauthorized');

    expect(transport.log).toHaveBeenCalledWith(
      expect.objectContaining({
        level: expect.stringContaining('warning'),
        message: expect.stringContaining('token is not valid'),
        stack: expect.stringContaining('Error: verification failed'),
      }),
      expect.any(Function),
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

    expect(transport.log).toHaveBeenCalledWith(
      expect.objectContaining({
        level: expect.stringContaining('info'),
        message: expect.stringContaining('Request authorized'),
        metadata: expect.objectContaining({ policy }),
      }),
      expect.any(Function),
    );
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

    expect(transport.log).toHaveBeenCalledWith(
      expect.objectContaining({
        level: expect.stringContaining('info'),
        message: expect.stringContaining('Request authorized'),
        metadata: expect.objectContaining({ policy }),
      }),
      expect.any(Function),
    );
  });

  it('caches keys for issuers', async () => {
    jest.spyOn(jwk, 'decode').mockImplementation(() => {
      return {
        header: { kid: 'identifier-to-cache' },
        payload: { iss: 'issuer-url' },
      };
    });

    (axios.get as jest.Mock).mockImplementation(() => {
      return Promise.resolve({
        data: { keys: [{ kid: 'identifier-to-cache' }] },
      });
    });

    jwkToPem.mockImplementation(() => 'test-pem');

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

  it('should return a policy if the authorization token is provided', async () => {
    setupHappyPath({ 'custom:userId': 'test-custom:userId' });
    event = {
      authorizationToken: `Bearer ${TOKEN_VALUE}`,
      methodArn: 'a/b/c',
    };

    const policy = await handler(event, context);

    expect(policy).toBeDefined();
  });
});
