import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { asyncSyncHandler, post, put, remove } from './requests';

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

describe('Async Sync Handler', () => {
  let getAsyncSyncCompleterMock;

  beforeEach(() => {
    applicationContext.setTimeout = jest
      .fn()
      .mockImplementation(callback => callback());
    getAsyncSyncCompleterMock = jest.fn(() => () => false);
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

  it('should handle 504 timeout', async () => {
    applicationContext.getUniqueId = jest
      .fn()
      .mockImplementation(() => 'TEST_ID');

    const setAsyncSyncCompleterMock = jest.fn().mockImplementation(() => {});

    const requestMock = jest.fn(() => {});

    getAsyncSyncCompleterMock = jest.fn().mockImplementation(() => true);

    const removeAsyncSyncCompleterMock = jest.fn();

    const results = await asyncSyncHandler(
      {
        ...applicationContext,
        getAsynSyncUtil: () => ({
          getAsyncSyncCompleter: getAsyncSyncCompleterMock,
          removeAsyncSyncCompleter: removeAsyncSyncCompleterMock,
          setAsyncSyncCompleter: setAsyncSyncCompleterMock,
        }),
      },
      requestMock,
    ).catch(e => e);

    expect(getAsyncSyncCompleterMock).toHaveBeenCalledTimes(1);
    expect(removeAsyncSyncCompleterMock).toHaveBeenCalledTimes(1);
    expect(removeAsyncSyncCompleterMock).toHaveBeenCalledWith('TEST_ID');

    expect(results).toEqual({ statusCode: 504 });
  });
});
