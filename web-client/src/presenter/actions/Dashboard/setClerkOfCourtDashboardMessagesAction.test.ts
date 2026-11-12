import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setClerkOfCourtDashboardMessagesAction } from './setClerkOfCourtDashboardMessagesAction';

describe('setClerkOfCourtDashboardMessagesAction', () => {
  const mockMessages = [{ messageId: '1', subject: 'Hello' }];
  let getInboxMessagesForUserInteractor: jest.Mock;

  const run = (currentPage = 'DashboardClerkOfCourt') =>
    runAction(setClerkOfCourtDashboardMessagesAction, {
      modules: { presenter },
      state: {
        clerkOfCourtDashboardMessagesStatus: 'loading',
        currentPage,
        messages: [],
        user: { userId: 'clerk-of-court-id' },
      },
    });

  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;
    getInboxMessagesForUserInteractor = jest
      .fn()
      .mockResolvedValue(mockMessages);
    applicationContext.getUseCases = () =>
      ({
        getInboxMessagesForUserInteractor,
      }) as unknown as ReturnType<typeof applicationContext.getUseCases>;
  });

  it("should get the user's inbox messages, set them and mark them as loaded", async () => {
    const { state } = await run();

    expect(getInboxMessagesForUserInteractor.mock.calls[0][1]).toEqual({
      userId: 'clerk-of-court-id',
    });
    expect(state.messages).toEqual(mockMessages);
    expect(state.clerkOfCourtDashboardMessagesStatus).toEqual('loaded');
  });

  it('should mark the messages as failed and log the error when the request fails', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    getInboxMessagesForUserInteractor.mockRejectedValue('failed');

    const { state } = await run();

    expect(state.clerkOfCourtDashboardMessagesStatus).toEqual('error');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'setClerkOfCourtDashboardMessagesAction failed:',
      'failed',
    );
    consoleErrorSpy.mockRestore();
  });

  it('should not overwrite the messages when the user left the dashboard before the response', async () => {
    const { state } = await run('Messages');

    expect(state.messages).toEqual([]);
    expect(state.clerkOfCourtDashboardMessagesStatus).toEqual('loaded');
  });

  it('should ignore an older load that completes after a newer load', async () => {
    let resolveOlder: (value: unknown[]) => void = () => {};
    getInboxMessagesForUserInteractor
      .mockReturnValueOnce(
        new Promise(resolve => {
          resolveOlder = resolve;
        }),
      )
      .mockResolvedValueOnce(mockMessages);

    const olderRun = run();
    const { state: newerState } = await run();
    resolveOlder([]);
    const { state: olderState } = await olderRun;

    expect(newerState.messages).toEqual(mockMessages);
    expect(olderState.clerkOfCourtDashboardMessagesStatus).toEqual('loading');
  });
});
