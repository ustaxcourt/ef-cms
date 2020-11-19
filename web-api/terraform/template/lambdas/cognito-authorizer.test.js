jest.mock('jwk-to-pem', () => jest.fn());

const axios = require('axios');
const jwk = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const { handler } = require('./cognito-authorizer');

describe('cognito-authorizer', () => {
  let event, context;

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
    jest.spyOn(console, 'log').mockImplementation(() => {});

    event = {
      authorizationToken: 'Bearer tokenValue',
      methodArn:
        'arn:aws:execute-api:us-east-1:aws-account-id:api-gateway-id/stage/GET/path',
      type: 'TOKEN',
    };

    context = {
      awsRequestId: 'request-id',
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // eslint-disable-next-line jest/no-done-callback
  it('returns unauthorized when token is missing', done => {
    event.authorizationToken = '';

    handler(event, context, err => {
      expect(err).toBe('Unauthorized');
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('No authorizationToken found'),
      );
      done();
    });
  });

  // desired: returns unauthorized if there is an error in contacting the issuer
  it('throws an error if there is an error in contacting the issuer', () => {
    axios.get.mockImplementation(() => {
      throw new Error('any error');
    });

    expect(() => {
      handler(event, context, () => {});
    }).toThrow();
  });

  // eslint-disable-next-line jest/no-done-callback
  it('returns unauthorized if the issuer doesn’t return data in expected format', done => {
    axios.get.mockImplementation(() => {
      return Promise.resolve({ data: null });
    });

    handler(event, context, err => {
      expect(err).toBe('Unauthorized');
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Request error'),
        expect.any(Error),
      );
      done();
    });
  });

  // eslint-disable-next-line jest/no-done-callback
  it('returns unauthorized if issuer is not the cognito user pools', done => {
    axios.get.mockImplementation(() => {
      return Promise.resolve({
        data: { keys: [{ kid: 'not-expected-key-identifier' }] },
      });
    });

    handler(event, context, err => {
      expect(err).toBe('Unauthorized');
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Request error'),
        expect.any(Error),
      );
      done();
    });
  });

  // eslint-disable-next-line jest/no-done-callback
  it('returns unauthorized if token is not verified', done => {
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

    handler(event, context, err => {
      expect(err).toBe('Unauthorized');

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Unauthorized user'),
        'verification failed',
      );
      done();
    });
  });

  // eslint-disable-next-line jest/no-done-callback
  it('returns IAM policy to allow invoking requested lambda when authorized', done => {
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

    handler(event, context, (err, policy) => {
      expect(err).toBe(null);
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
      done();
    });
  });

  // eslint-disable-next-line jest/no-done-callback
  it('caches keys for issuers', done => {
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

    handler(event, context, () => {
      // First call is not cached
      expect(axios.get).toHaveBeenCalledTimes(1);

      handler(event, context, () => {
        // Second call is cached
        expect(axios.get).toHaveBeenCalledTimes(1);
        done();
      });
    });
  });
});
