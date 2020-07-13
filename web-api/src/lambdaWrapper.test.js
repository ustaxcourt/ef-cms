const { lambdaWrapper } = require('./lambdaWrapper');

describe('lambdaWrapper', () => {
  let req, res;

  beforeEach(() => {
    req = { body: 'blank' };
    res = {
      json: jest.fn(),
      redirect: jest.fn(),
      send: jest.fn(),
      status: jest.fn(),
    };
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

  it('calls res.json if header is application/json', async () => {
    await lambdaWrapper(() => {
      return {
        body: '{}',
        headers: {
          'Content-Type': 'application/json',
        },
      };
    })(req, res);
    expect(res.json).toHaveBeenCalled();
  });

  it('calls res.json if header is application/json', async () => {
    await lambdaWrapper(() => {
      return {
        body: null,
        headers: {
          'Content-Type': 'application/json',
        },
      };
    })(req, res);
    expect(res.json).toHaveBeenCalled();
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
});
