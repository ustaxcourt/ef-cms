import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { resolveAsyncSyncRequestAction } from '@web-client/presenter/actions/resolveAsyncSyncRequestAction';
import { runAction } from 'cerebral/test';

describe('resolveAsyncSyncRequestAction', () => {
  const asyncSyncCompleterDict = {
    asyncSyncId1: jest.fn(),
    asyncSyncId2: jest.fn(),
  };

  const mockGetAsyncSyncCompleter = jest.fn(id => asyncSyncCompleterDict[id]);
  const mockRemoveAsyncSyncCompleter = jest.fn(() => {});

  presenter.providers.applicationContext = {
    ...applicationContext,
    getAsynSyncUtil: jest.fn().mockReturnValue({
      getAsyncSyncCompleter: mockGetAsyncSyncCompleter,
      removeAsyncSyncCompleter: mockRemoveAsyncSyncCompleter,
    }),
  };

  it('should call callback with response if callback exists', async () => {
    const asyncSyncId = 'asyncSyncId1';
    const response = 'testResponse';

    await runAction(resolveAsyncSyncRequestAction as any, {
      modules: {
        presenter,
      },
      props: {
        asyncSyncId,
        response,
      },
    });

    expect(mockGetAsyncSyncCompleter).toHaveBeenCalledWith(asyncSyncId);
    expect(asyncSyncCompleterDict[asyncSyncId]).toHaveBeenCalledWith(response);
    expect(mockRemoveAsyncSyncCompleter).toHaveBeenCalledWith(asyncSyncId);
  });
});
