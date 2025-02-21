import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { asyncSyncHandler } from './requests';

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
