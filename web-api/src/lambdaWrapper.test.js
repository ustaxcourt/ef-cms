const { lambdaWrapper } = require('./lambdaWrapper');

describe('lambdaWrapper', () => {
  let req, res;

  beforeEach(() => {
    req = {
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

  it('sets request timeout to 20 minutes', async () => {
    await lambdaWrapper(() => {
      return {
        body: 'hello world',
        headers: {
          'Content-Type': 'application/pdf',
        },
      };
    })(req, res);

    expect(req.setTimeout).toHaveBeenCalled();
    expect(req.setTimeout).toHaveBeenCalledWith(20 * 60 * 1000);
  });
});
