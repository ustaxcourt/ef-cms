import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import { ClerkDashboardTrialSessions } from '@web-api/business/useCases/reports/getClerkDashboardTrialSessionsInteractor';
import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setClerkOfCourtDashboardTrialSessionsAction } from './setClerkOfCourtDashboardTrialSessionsAction';

describe('setClerkOfCourtDashboardTrialSessionsAction', () => {
  const mockTrialSessions: ClerkDashboardTrialSessions = {
    trialSessions: [new TrialSessionInfoDTO(MOCK_TRIAL_REGULAR)],
    weeks: {
      currentWeekEnd: '2026-11-16T04:59:59.999Z',
      currentWeekStart: '2026-11-09T05:00:00.000Z',
      nextWeekEnd: '2026-11-23T04:59:59.999Z',
      nextWeekStart: '2026-11-16T05:00:00.000Z',
    },
  };
  const emptyTrialSessions: ClerkDashboardTrialSessions = { trialSessions: [] };
  let getClerkDashboardTrialSessionsInteractor: jest.Mock;

  const run = () =>
    runAction(setClerkOfCourtDashboardTrialSessionsAction, {
      modules: { presenter },
      state: {
        clerkOfCourtDashboardTrialSessions: {
          data: emptyTrialSessions,
          status: 'loading',
        },
      },
    });

  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;
    getClerkDashboardTrialSessionsInteractor = jest
      .fn()
      .mockResolvedValue(mockTrialSessions);
    applicationContext.getUseCases = () =>
      ({
        getClerkDashboardTrialSessionsInteractor,
      }) as unknown as ReturnType<typeof applicationContext.getUseCases>;
  });

  it('should set the trial sessions and mark them as loaded', async () => {
    const { state } = await run();

    expect(state.clerkOfCourtDashboardTrialSessions).toEqual({
      data: mockTrialSessions,
      status: 'loaded',
    });
  });

  it('should mark the trial sessions as failed and log the error when the request fails', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    getClerkDashboardTrialSessionsInteractor.mockRejectedValue('failed');

    const { state } = await run();

    expect(state.clerkOfCourtDashboardTrialSessions.status).toEqual('error');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'setClerkOfCourtDashboardTrialSessionsAction failed:',
      'failed',
    );
    consoleErrorSpy.mockRestore();
  });

  it('should ignore an older load that completes after a newer load', async () => {
    let resolveOlder: (value: ClerkDashboardTrialSessions) => void = () => {};
    getClerkDashboardTrialSessionsInteractor
      .mockReturnValueOnce(
        new Promise(resolve => {
          resolveOlder = resolve;
        }),
      )
      .mockResolvedValueOnce(mockTrialSessions);

    const olderRun = run();
    const { state: newerState } = await run();
    resolveOlder(emptyTrialSessions);
    const { state: olderState } = await olderRun;

    expect(newerState.clerkOfCourtDashboardTrialSessions.data).toEqual(
      mockTrialSessions,
    );
    expect(olderState.clerkOfCourtDashboardTrialSessions).toEqual({
      data: emptyTrialSessions,
      status: 'loading',
    });
  });
});
