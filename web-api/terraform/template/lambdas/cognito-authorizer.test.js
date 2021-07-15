jest.mock('jwk-to-pem', () => jest.fn());
jest.mock('../../../../shared/src/utilities/createLogger', () => {
  return { createLogger: jest.fn() };
});
const { createLogger: actualCreateLogger } = jest.requireActual(
  '../../../../shared/src/utilities/createLogger',
);
const axios = require('axios');
const fs = require('fs');
const jwk = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const {
  createLogger,
} = require('../../../../shared/src/utilities/createLogger');
const { handler } = require('./cognito-authorizer');
const { transports } = require('winston');

describe('cognito-authorizer', () => {
  let event, context, transport;

  beforeEach(() => {
    jest.spyOn(axios, 'get').mockImplementation(() => {});
    jest.spyOn(jwk, 'decode').mockImplementation(token => {
      // This test code does not need to be resistant to timing attacks.
      // eslint-disable-next-line security/detect-possible-timing-attacks
      if (token === 'tokenValue') {
        return {
          header: { kid: 'key-identifier' },
          payload: { iss: `issuer-url-${Math.random()}` },
        };
      } else {
        throw new Error('token not passed to jek.decode');
      }
    });
    jest.spyOn(jwk, 'verify').mockImplementation(() => {});
    transport = new transports.Stream({
      stream: fs.createWriteStream('/dev/null'),
    });
    jest.spyOn(transport, 'log').mockImplementation(() => {});
    createLogger.mockImplementation(opts => {
      opts.transports = [transport];
      return actualCreateLogger(opts);
    });

    event = {
      authorizationToken: 'Bearer tokenValue',
      methodArn:
        'arn:aws:execute-api:us-east-1:aws-account-id:api-gateway-id/stage/GET/path',
      type: 'TOKEN',
    };

    context = {
      awsRequestId: 'request-id',
      logLevel: 'debug',
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
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
    axios.get.mockImplementation(() => {
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
    axios.get.mockImplementation(() => {
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
    axios.get.mockImplementation(() => {
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
    axios.get.mockImplementation(() => {
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
      if (token !== 'tokenValue' || pem !== 'test-pem') {
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
    axios.get.mockImplementation(() => {
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
      if (token !== 'tokenValue' || pem !== 'test-pem') {
        throw new Error('wrong token or pem was passed to verification');
      }

      expect(options.issuer).toBeDefined();
      callback(null, { sub: 'test-sub' });
    });

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
        principalId: 'test-sub',
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

  it('returns IAM policy to allow invoking requested lambda when authorized using the payload custom:userId instead of sub', async () => {
    axios.get.mockImplementation(() => {
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
      if (token !== 'tokenValue' || pem !== 'test-pem') {
        throw new Error('wrong token or pem was passed to verification');
      }

      expect(options.issuer).toBeDefined();
      callback(null, { 'custom:userId': 'test-custom:userId' });
    });

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

    axios.get.mockImplementation(() => {
      return Promise.resolve({
        data: { keys: [{ kid: 'identifier-to-cache' }] },
      });
    });

    jwkToPem.mockImplementation(() => 'test-pem');

    jwk.verify.mockImplementation((token, pem, options, callback) => {
      callback(null, { sub: 'test-sub' });
    });

    await handler(event, context);

    // First call is not cached
    expect(axios.get).toHaveBeenCalledTimes(1);

    await handler(event, context);

    // Second call is cached
    expect(axios.get).toHaveBeenCalledTimes(1);
  });
});
