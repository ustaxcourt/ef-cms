const fs = require('fs');
const logger = require('./logger');
const { transports } = require('winston');

describe('logger', () => {
  let req, res, NODE_ENV;

  beforeEach(() => {
    ({ NODE_ENV } = process.env);

    req = {
      get: jest.fn(),
      method: '',
      url: '',
    };

    res = {
      end: jest.fn(),
      statusCode: 200,
    };
  });

  afterEach(() => {
    process.env.NODE_ENV = NODE_ENV;
  });

  const subject = async (request, response) =>
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

  it('defaults to using a console logger if not specified', async () => {
    const middleware = logger();

    jest.spyOn(console, 'log');
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

  it('passes request IDs to event if set in production', async () => {
    process.env.NODE_ENV = 'production';

    // set by aws-serverless-express.eventContext()
    req.apiGateway = {
      context: {
        awsRequestId: 'c840522b-1e43-4d03-995c-014d199fa237',
      },
      event: {
        requestContext: {
          requestId: '11ff704e-b35b-4472-8280-29be3fb957ca',
        },
      },
    };

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

    await Promise.all(
      [
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
      ].map(async partialConfig => {
        const request = { ...req, ...partialConfig };

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
      }),
    );
  });
});
