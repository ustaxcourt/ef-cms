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
  const MOCKED_ID = 'MOCKED_ID';

  beforeEach(() => {
    applicationContext.setTimeout = jest
      .fn()
      .mockImplementation(callback => callback());
    applicationContext.getUseCases().startPollingForResultsInteractor = jest
      .fn()
      .mockImplementation((_, __, ___, resolver) => {
        resolver({
          body: 'body',
          statusCode: '200',
        });
      });
  });

  it('should setup the callback and execute the request', async () => {
    applicationContext.getUniqueId = jest
      .fn()
      .mockImplementation(() => MOCKED_ID);

    const requestMock = jest.fn();

    await asyncSyncHandler(applicationContext, requestMock);

    const requestCalls = requestMock.mock.calls;
    expect(requestCalls.length).toEqual(1);
    const ASYNC_SYNC_ID = requestCalls[0][0];
    expect(ASYNC_SYNC_ID).toEqual(MOCKED_ID);

    expect(
      applicationContext.getUseCases().startPollingForResultsInteractor,
    ).toHaveBeenCalled();
  });
});
