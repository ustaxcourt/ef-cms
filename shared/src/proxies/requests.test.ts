import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { asyncSyncHandler, asyncSyncPost, post, put, remove } from './requests';

const mockFail503 = Promise.reject({
  response: {
    headers: {},
    message: 'Currently locked',
    status: 503,
  },
});

const mockFail503RetryAfter = Promise.reject({
  response: {
    headers: {
      'Retry-After': 100,
    },
    message: 'Currently locked',
    status: 503,
  },
});

const mockSuccess = Promise.resolve({
  response: {
    headers: {},
    message: 'Success',
    status: 200,
  },
});

const funcMap = [
  {
    func: post,
    name: 'post',
  },
  {
    func: put,
    name: 'put',
  },
  {
    func: remove,
    name: 'delete',
  },
];

describe('requests that perform writes', () => {
  funcMap.forEach(({ func, name }) => {
    describe(`request function ${name}`, () => {
      it('should attempt to sleep for 5 seconds if response is a 503 and Retry-After is not specified', async () => {
        applicationContext
          .getHttpClient()
          [name].mockImplementationOnce(() => mockFail503)
          .mockImplementationOnce(() => mockSuccess);

        await func({
          applicationContext,
          body: { foo: 'bar' },
          endpoint: '/users',
        });

        expect(
          applicationContext.getUtilities().sleep,
        ).toHaveBeenLastCalledWith(5000);
        expect(applicationContext.getHttpClient()[name].mock.calls.length).toBe(
          2,
        );
      });

      it('should retry the operation after number of milliseconds specified if response is a 503 and Retry-After is in headers', async () => {
        const waitTime = 100;
        applicationContext
          .getHttpClient()
          [name].mockImplementationOnce(() => mockFail503RetryAfter)
          .mockImplementationOnce(() => mockSuccess);

        await func({
          applicationContext,
          body: { foo: 'bar' },
          endpoint: '/users',
        });
        expect(
          applicationContext.getUtilities().sleep,
        ).toHaveBeenLastCalledWith(waitTime);
        expect(applicationContext.getHttpClient()[name].mock.calls.length).toBe(
          2,
        );
      });

      it('should try the operation eleven times before it gives up', async () => {
        applicationContext
          .getHttpClient()
          [name].mockImplementation(() => mockFail503);

        await expect(
          func({
            applicationContext,
            body: { foo: 'bar' },
            endpoint: '/users',
          }),
        ).rejects.toMatchObject({
          response: {
            message: 'Currently locked',
            status: 503,
          },
        });
        expect(applicationContext.getHttpClient()[name].mock.calls.length).toBe(
          11,
        );
      });
    });
  });
});

describe('Asyn Sync Request', () => {
  it('should setup the callback and trigger an http request', async () => {
    let promiseCallback;

    applicationContext.getUniqueId = jest
      .fn()
      .mockImplementation(() => 'TEST_ID');

    applicationContext.getHttpClient().post = jest
      .fn()
      .mockImplementation(() => {
        promiseCallback({
          body: 'body',
          statusCode: '200',
        });
      });

    const setAsyncSyncCompleterMock = jest
      .fn()
      .mockImplementation((_, callback) => {
        promiseCallback = callback;
      });

    const request = {
      applicationContext: {
        ...applicationContext,
        getAsynSyncUtil: () => ({
          setAsyncSyncCompleter: setAsyncSyncCompleterMock,
        }),
      },
      body: 'REQUEST_BODY',
      endpoint: 'TEST_ENDPOINT',
    };

    await asyncSyncPost(request);

    const setAsyncSyncResultCalls = setAsyncSyncCompleterMock.mock.calls;
    expect(setAsyncSyncResultCalls.length).toEqual(1);
    expect(setAsyncSyncResultCalls[0][0]).toEqual('TEST_ID');
    expect(typeof setAsyncSyncResultCalls[0][1]).toEqual('function');

    const postCalls = applicationContext.getHttpClient().post.mock.calls;
    expect(postCalls.length).toEqual(1);
    const [URL, BODY, OPTIONS] = postCalls[0];
    expect(URL).toEqual('http://localhostTEST_ENDPOINT');
    expect(BODY).toEqual('REQUEST_BODY');
    expect(OPTIONS).toMatchObject({
      headers: {
        asyncSyncId: 'TEST_ID',
      },
    });
  });

  it('should setup the callback and execute the request', async () => {
    let promiseCallback;

    applicationContext.getUniqueId = jest
      .fn()
      .mockImplementation(() => 'TEST_ID');

    const setAsyncSyncCompleterMock = jest
      .fn()
      .mockImplementation((_, callback) => {
        promiseCallback = callback;
      });

    const requestMock = jest.fn(() => {
      promiseCallback({
        body: 'body',
        statusCode: '200',
      });
    });

    await asyncSyncHandler(
      {
        ...applicationContext,
        getAsynSyncUtil: () => ({
          setAsyncSyncCompleter: setAsyncSyncCompleterMock,
        }),
      },
      requestMock,
    );

    const setAsyncSyncResultCalls = setAsyncSyncCompleterMock.mock.calls;
    expect(setAsyncSyncResultCalls.length).toEqual(1);
    expect(setAsyncSyncResultCalls[0][0]).toEqual('TEST_ID');
    expect(typeof setAsyncSyncResultCalls[0][1]).toEqual('function');

    const requestCalls = requestMock.mock.calls;
    expect(requestCalls.length).toEqual(1);
    const ASYNC_SYNC_ID = requestCalls[0][0];
    expect(ASYNC_SYNC_ID).toEqual('TEST_ID');
  });
});
