const { lambdaWrapper } = require('./lambdaWrapper');

describe('lambdaWrapper', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: 'blank',
      headers: {},
    };
    res = {
      headers: {},
      json: jest.fn(),
      redirect: jest.fn(),
      send: jest.fn(),
      set: jest.fn(),
      status: jest.fn(),
    };
    JSON.parse = jest.fn();
  });

  it('sets res.headers', async () => {
    await lambdaWrapper(() => {
      return {
        body: 'hello world',
        headers: {
          'Content-Type': 'application/pdf',
        },
      };
    })(req, res);

    expect(res.set).toHaveBeenCalledWith({
      'Access-Control-Allow-Origin': '*',
      'Cache-Control':
        'max-age=0, private, no-cache, no-store, must-revalidate',
      'Content-Type': 'application/json',
      Pragma: 'no-cache',
      Vary: 'Authorization',
      'X-Content-Type-Options': 'nosniff',
    });
  });

  it('sends response.body if header is application/pdf', async () => {
    await lambdaWrapper(() => {
      return {
        body: 'hello world',
        headers: {
          'Content-Type': 'application/pdf',
        },
      };
    })(req, res);
    expect(res.send).toHaveBeenCalled();
    expect(res.set.mock.calls[1][0]).toBe('Content-Type');
    expect(res.set.mock.calls[1][1]).toBe('application/pdf');
  });

  it('sends response.body if header is application/text', async () => {
    await lambdaWrapper(() => {
      return {
        body: 'hello world',
        headers: {
          'Content-Type': 'text/html',
        },
      };
    })(req, res);
    expect(res.send).toHaveBeenCalled();
  });

  it('calls res.send with a JSON parsed body when header is application/json', async () => {
    await lambdaWrapper(() => {
      return {
        body: '{}',
        headers: {
          'Content-Type': 'application/json',
        },
      };
    })(req, res);
    expect(JSON.parse).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalled();
  });

  it('calls res.redirect if header Location is set', async () => {
    await lambdaWrapper(() => {
      return {
        body: null,
        headers: {
          Location: 'http://example.com',
        },
      };
    })(req, res);
    expect(res.redirect).toHaveBeenCalled();
  });

  it('logs exception if unhandled response', async () => {
    jest.spyOn(console, 'log');
    await lambdaWrapper(() => {
      return {
        body: null,
        headers: {},
      };
    })(req, res);
    expect(console.log).toHaveBeenCalledWith(
      'ERROR: we do not support this return type',
    );
  });

  describe('request IDs', () => {
    it('passes request IDs to event if set', async () => {
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

      req.headers = {
        'x-amzn-trace-id': 'Root=1-5fa1efc9-164cfd9602fe2b523bf82292;Sampled=0',
      };

      await lambdaWrapper(event => {
        expect(event.requestId).toBeDefined();
        expect(event.requestId.apiGateway).toBe(
          '11ff704e-b35b-4472-8280-29be3fb957ca',
        );
        expect(event.requestId.applicationLoadBalancer).toBe(
          'Root=1-5fa1efc9-164cfd9602fe2b523bf82292;Sampled=0',
        );
        expect(event.requestId.lambda).toBe(
          'c840522b-1e43-4d03-995c-014d199fa237',
        );

        return {
          body: null,
          headers: {},
        };
      })(req, res);
    });

    it('doesn’t choke if request IDs are missing', async () => {
      req.apiGateway = {
        context: {},
        event: {
          requestContext: {},
        },
      };

      req.headers = {};

      await lambdaWrapper(event => {
        expect(event.requestId).toBeDefined();
        expect(event.requestId.apiGateway).not.toBeDefined();
        expect(event.requestId.applicationLoadBalancer).not.toBeDefined();
        expect(event.requestId.lambda).not.toBeDefined();

        return {
          body: null,
          headers: {},
        };
      })(req, res);
    });
  });
});
