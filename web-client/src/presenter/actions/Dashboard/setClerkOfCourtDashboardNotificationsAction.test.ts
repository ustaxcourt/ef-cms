import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setClerkOfCourtDashboardNotificationsAction } from './setClerkOfCourtDashboardNotificationsAction';

describe('setClerkOfCourtDashboardNotificationsAction', () => {
  const mockNotifications = { qcSectionInboxCount: 3 };
  const previousNotifications = { qcSectionInboxCount: 1 };
  let getNotificationsInteractor: jest.Mock;

  const run = (currentPage = 'DashboardClerkOfCourt') =>
    runAction(setClerkOfCourtDashboardNotificationsAction, {
      modules: { presenter },
      state: {
        alertError: undefined,
        currentPage,
        judgeUser: {},
        messageBoxToDisplay: {},
        notifications: previousNotifications,
        user: { section: 'clerkofcourt', userId: 'clerk-of-court-id' },
        workQueueToDisplay: {},
      },
    });

  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;
    getNotificationsInteractor = jest.fn().mockResolvedValue(mockNotifications);
    applicationContext.getUseCases = () =>
      ({
        getNotificationsInteractor,
      }) as unknown as ReturnType<typeof applicationContext.getUseCases>;
  });

  it("should get the user's notifications and set them", async () => {
    const { state } = await run();

    expect(getNotificationsInteractor.mock.calls[0][1]).toMatchObject({
      section: 'clerkofcourt',
    });
    expect(state.notifications).toEqual(mockNotifications);
  });

  it('should log the error, keep the current notifications and show an alert when the request fails', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    getNotificationsInteractor.mockRejectedValue('failed');

    const { state } = await run();

    expect(state.notifications).toEqual(previousNotifications);
    expect(state.alertError).toEqual({
      message:
        'Your notification counts may be out of date. Please refresh the page.',
      title: 'Notifications could not be loaded',
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'setClerkOfCourtDashboardNotificationsAction failed:',
      'failed',
    );
    consoleErrorSpy.mockRestore();
  });

  it('should not show an alert when the request fails after the user left the dashboard', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    getNotificationsInteractor.mockRejectedValue('failed');

    const { state } = await run('Messages');

    expect(state.alertError).toBeUndefined();
    jest.restoreAllMocks();
  });

  it('should not show an alert when an older load fails after a newer load', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    let rejectOlder: (reason: unknown) => void = () => {};
    getNotificationsInteractor
      .mockReturnValueOnce(
        new Promise((_resolve, reject) => {
          rejectOlder = reject;
        }),
      )
      .mockResolvedValueOnce(mockNotifications);

    const olderRun = run();
    await run();
    rejectOlder('failed');
    const { state: olderState } = await olderRun;

    expect(olderState.alertError).toBeUndefined();
    jest.restoreAllMocks();
  });

  it('should not overwrite the notifications when the user left the dashboard before the response', async () => {
    const { state } = await run('Messages');

    expect(state.notifications).toEqual(previousNotifications);
  });

  it('should ignore an older load that completes after a newer load', async () => {
    let resolveOlder: (value: unknown) => void = () => {};
    getNotificationsInteractor
      .mockReturnValueOnce(
        new Promise(resolve => {
          resolveOlder = resolve;
        }),
      )
      .mockResolvedValueOnce(mockNotifications);

    const olderRun = run();
    const { state: newerState } = await run();
    resolveOlder({ qcSectionInboxCount: 99 });
    const { state: olderState } = await olderRun;

    expect(newerState.notifications).toEqual(mockNotifications);
    expect(olderState.notifications).toEqual(previousNotifications);
  });
});
