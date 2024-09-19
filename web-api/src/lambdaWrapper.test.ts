import { CHUNK_SIZE, lambdaWrapper } from './lambdaWrapper';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
jest.mock('@vendia/serverless-express');
jest.mock('@web-api/middleware/apiGatewayHelper');
import { getCurrentInvoke } from '@vendia/serverless-express';
import { getUserFromAuthHeader } from '@web-api/middleware/apiGatewayHelper';

describe('lambdaWrapper', () => {
  let req, res;
  let orignalParse;

  beforeAll(() => {
    (getCurrentInvoke as jest.Mock).mockReturnValue({
      event: {},
    });

    orignalParse = JSON.parse;
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

    JSON.parse = jest.fn().mockImplementation(json => orignalParse(json));

    (getUserFromAuthHeader as jest.Mock).mockReturnValue({ userId: 'user-id' });
  });

  afterAll(() => {
    JSON.parse = orignalParse;
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
    expect(res.send).toHaveBeenCalledWith(null);
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
    (getCurrentInvoke as jest.Mock).mockReturnValue({
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
    (getCurrentInvoke as jest.Mock).mockReturnValue({
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

  it('should return 204 when simulating an async/sync function', async () => {
    await lambdaWrapper(
      () => {
        return {
          body: 'hello world',
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
      { isAsyncSync: true },
    )(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
  });

  it('should save response to database when asyncsyncid is present', async () => {
    req.headers.asyncsyncid = 'some-id';
    const TEST_BODY = {
      testBody: 'SOMETHING',
    };
    const response = { a: 'LAMBDA_RESULTS', body: JSON.stringify(TEST_BODY) };
    await lambdaWrapper(
      () => response,
      { isAsyncSync: true },
      applicationContext,
    )(req, res);

    expect(
      applicationContext.getNotificationGateway().saveRequestResponse,
    ).toHaveBeenCalledWith({
      applicationContext,
      chunk: JSON.stringify({ a: 'LAMBDA_RESULTS', body: TEST_BODY }),
      index: 0,
      requestId: 'some-id',
      totalNumberOfChunks: 1,
      userId: 'user-id',
    });
  });

  it('should save multiple chunks when over max chunk size', async () => {
    req.headers.asyncsyncid = 'some-id';
    const TEST_BODY = {
      testBody: 'z'.repeat(CHUNK_SIZE),
    };
    let response = { a: 'LAMBDA_RESULTS', body: JSON.stringify(TEST_BODY) };
    await lambdaWrapper(
      () => response,
      { isAsyncSync: true },
      applicationContext,
    )(req, res);

    response = {
      ...response,
      body: JSON.parse(response.body),
    };

    // chunk pt1
    expect(
      applicationContext.getNotificationGateway().saveRequestResponse,
    ).toHaveBeenCalledTimes(2);
    expect(
      applicationContext.getNotificationGateway().saveRequestResponse.mock
        .calls[0][0],
    ).toMatchObject({
      index: 0,
      totalNumberOfChunks: 2,
    });
    expect(
      applicationContext.getNotificationGateway().saveRequestResponse.mock
        .calls[0][0].chunk,
    ).toHaveLength(CHUNK_SIZE);

    // chunk pt2
    expect(
      applicationContext.getNotificationGateway().saveRequestResponse.mock
        .calls[1][0],
    ).toMatchObject({
      index: 1,
      totalNumberOfChunks: 2,
    });
    expect(
      applicationContext.getNotificationGateway().saveRequestResponse.mock
        .calls[1][0].chunk,
    ).toHaveLength(JSON.stringify(response).length - CHUNK_SIZE);
  });
});
