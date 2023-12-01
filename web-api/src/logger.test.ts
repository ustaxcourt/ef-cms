import { logger } from './logger';
import { transports } from 'winston';
import fs from 'fs';
jest.mock('@vendia/serverless-express');
import { getCurrentInvoke } from '@vendia/serverless-express';

describe('logger', () => {
  let req, res, NODE_ENV;
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  beforeEach(() => {
    ({ NODE_ENV } = process.env);

    req = {
      get: jest.fn(),
      method: '',
      url: '',
    };

    res = {
      end: jest.fn(),
      get(key) {
        return {
          'content-length': '500',
        }[key];
      },
      statusCode: 200,
    };
  });

  afterEach(() => {
    process.env.NODE_ENV = NODE_ENV;
  });

  const subject = (request, response) =>
    new Promise(resolve => {
      const middleware = logger(
        new transports.Stream({
          stream: fs.createWriteStream('/dev/null'),
        }),
      );
      middleware(request, response, resolve);
    });

  it('creates a logger and exposes it on req.locals.logger', async () => {
    await subject(req, res);

    expect(req.locals.logger).toBeDefined();
  });

  it('defaults to using a console logger if not specified', () => {
    const middleware = logger();

    jest.spyOn(console, 'log').mockImplementation(jest.fn());
    middleware(req, res, () => {
      req.locals.logger.info('test', () => {
        expect(console.log).toHaveBeenCalled();
        console.log.mockRestore();
      });
    });
  });

  it('logs when a request completes with the response statusCode', async () => {
    await subject(req, res);
    const instance = req.locals.logger;

    instance.info = jest.fn();

    res.end();

    expect(instance.info).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        response: expect.objectContaining({
          statusCode: 200,
        }),
      }),
    );
  });

  it('sets logger.defaultMeta.environment color stage to from the environment variables', async () => {
    process.env.NODE_ENV = 'production';
    process.env.CURRENT_COLOR = 'blue';
    process.env.STAGE = 'someEnv';

    await subject(req, res);
    const instance = req.locals.logger;

    instance.info = jest.fn();

    res.end();
    expect(instance.defaultMeta.environment).toEqual({
      color: 'blue',
      stage: 'someEnv',
    });
  });

  it('sets logger.defaultMeta.environment color to green and stage to local when those environment variables are undefined', async () => {
    delete process.env.CURRENT_COLOR;
    delete process.env.STAGE;
    process.env.NODE_ENV = 'production';

    await subject(req, res);
    const instance = req.locals.logger;

    instance.info = jest.fn();

    res.end();
    expect(instance.defaultMeta.environment).toEqual({
      color: 'green',
      stage: 'local',
    });
  });

  it('passes request IDs to event if set in production', async () => {
    process.env.NODE_ENV = 'production';

    // set by aws-serverless-express.getCurrentInvoke()
    getCurrentInvoke.mockReturnValueOnce({
      context: {
        awsRequestId: 'c840522b-1e43-4d03-995c-014d199fa237',
      },
      event: {
        requestContext: {
          requestId: '11ff704e-b35b-4472-8280-29be3fb957ca',
        },
      },
    });

    req.get.mockImplementation(key => {
      if (key === 'x-amzn-trace-id') {
        return 'Root=1-5fa1efc9-164cfd9602fe2b523bf82292;Sampled=0';
      }
    });

    await subject(req, res);

    expect(req.locals.logger.defaultMeta.requestId).toBeDefined();
    expect(req.locals.logger.defaultMeta.requestId.apiGateway).toBe(
      '11ff704e-b35b-4472-8280-29be3fb957ca',
    );
    expect(
      req.locals.logger.defaultMeta.requestId.applicationLoadBalancer,
    ).toBe('Root=1-5fa1efc9-164cfd9602fe2b523bf82292;Sampled=0');
    expect(req.locals.logger.defaultMeta.requestId.lambda).toBe(
      'c840522b-1e43-4d03-995c-014d199fa237',
    );
  });

  it('doesn’t choke if request IDs are missing in production', async () => {
    process.env.NODE_ENV = 'production';

    const mockReturnValues = [
      { apiGateway: {} },
      {
        apiGateway: {
          context: {},
          event: {},
        },
      },
      {
        apiGateway: {
          context: {},
          event: {
            requestContext: {},
          },
        },
      },
    ];

    for (const apiGateway of mockReturnValues) {
      getCurrentInvoke.mockReturnValueOnce(apiGateway);
      const request = { ...req };

      await subject(request, res);

      expect(request.locals.logger.defaultMeta.requestId).toBeDefined();
      expect(
        request.locals.logger.defaultMeta.requestId.apiGateway,
      ).not.toBeDefined();
      expect(
        request.locals.logger.defaultMeta.requestId.applicationLoadBalancer,
      ).not.toBeDefined();
      expect(
        request.locals.logger.defaultMeta.requestId.lambda,
      ).not.toBeDefined();
    }
  });

  it('does not log a password if it was included in the body of the request', () => {
    process.env.NODE_ENV = 'production';
    const body = {
      confirmPassword: 'Password1!',
      password: 'Password1!',
      username: 'Usern4me',
    };
    req.body = body;
    subject(req, res);

    const bodyToBeLogged = JSON.parse(
      req.locals.logger.defaultMeta.request.body,
    );

    expect(bodyToBeLogged.username).toBe(body.username);
    expect(bodyToBeLogged.password).not.toBe(body.password);
    expect(bodyToBeLogged.password).toBe('*** REDACTED ***');
    expect(bodyToBeLogged.confirmPassword).not.toBe(body.confirmPassword);
    expect(bodyToBeLogged.confirmPassword).toBe('*** REDACTED ***');
  });
});
