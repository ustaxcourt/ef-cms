const { lambdaWrapper } = require('./lambdaWrapper');
jest.mock('@vendia/serverless-express');
const { getCurrentInvoke } = require('@vendia/serverless-express');

describe('lambdaWrapper', () => {
  let req, res;

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  beforeEach(() => {
    req = {
      apiGateway: {},
      body: 'blank',
      headers: {},
      locals: {},
      setTimeout: jest.fn(),
    };
    res = {
      headers: {},
      json: jest.fn(),
      redirect: jest.fn(),
      send: jest.fn(),
      set: jest.fn(),
      status: jest.fn().mockReturnValue({
        send: jest.fn(),
      }),
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
      'Access-Control-Expose-Headers': 'X-Terminal-User',
      'Cache-Control':
        'max-age=0, private, no-cache, no-store, must-revalidate',
      'Content-Type': 'application/json',
      Pragma: 'no-cache',
      Vary: 'Authorization',
      'X-Content-Type-Options': 'nosniff',
      'X-Terminal-User': false,
    });
    expect(res.set.mock.calls[1][0]).toEqual('Content-Type');
    expect(res.set.mock.calls[1][1]).toEqual('application/pdf');
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

  it('calls res.send with when there is no res.body and when header is application/json', async () => {
    await lambdaWrapper(() => {
      return {
        body: undefined,
        headers: {
          'Content-Type': 'application/json',
        },
      };
    })(req, res);
    expect(JSON.parse).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith(undefined);
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

  it('sets X-Terminal-User if it was set in api gateway event context', async () => {
    getCurrentInvoke.mockReturnValue({
      event: { requestContext: { authorizer: { isTerminalUser: 'true' } } },
    });
    await lambdaWrapper(() => {
      return {
        body: 'hello world',
        headers: {
          'Content-Type': 'application/pdf',
        },
      };
    })(req, res);

    expect(res.set.mock.calls[0][0]).toEqual({
      'Access-Control-Expose-Headers': 'X-Terminal-User',
      'Cache-Control':
        'max-age=0, private, no-cache, no-store, must-revalidate',
      'Content-Type': 'application/json',
      Pragma: 'no-cache',
      Vary: 'Authorization',
      'X-Content-Type-Options': 'nosniff',
      'X-Terminal-User': true,
    });
    expect(res.set.mock.calls[1][0]).toEqual('Content-Type');
    expect(res.set.mock.calls[1][1]).toEqual('application/pdf');
  });

  it('returns 204 when it is simulating an async function', async () => {
    getCurrentInvoke.mockReturnValue({
      event: { requestContext: { authorizer: { isTerminalUser: 'false' } } },
    });
    await lambdaWrapper(
      () => {
        return {
          body: 'hello world',
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
      { isAsync: true },
    )(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
  });
});
