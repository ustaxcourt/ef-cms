import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setClerkOfCourtDashboardChartsAction } from './setClerkOfCourtDashboardChartsAction';
import {
  ClerkDashboardCasesTabStats,
  ClerkDashboardPetitionsTabStats,
} from '@web-api/business/useCases/reports/clerkDashboardStats';

describe('setClerkOfCourtDashboardChartsAction', () => {
  const mockPetitionsStats: ClerkDashboardPetitionsTabStats = {
    calendarYearPetitionStats: {
      petitionFullPaperMonths: [],
      petitionFullElectronicMonths: [],
      petitionsByRepresentation: [],
      petitionsByServiceType: [],
    },
    fiscalYearPetitionStats: {
      petitionFullPaperMonths: [],
      petitionFullElectronicMonths: [],
      petitionsByRepresentation: [],
      petitionsByServiceType: [],
    },
    year: '2026',
    fiscalYear: '2027',
  };

  const mockCasesStats: ClerkDashboardCasesTabStats = {
    openCasesByCaseType: [],
    openCasesByProcedureType: [],
    calendarYearCaseStats: {
      casesClosedByMonth: [],
      casesClosedByProcedureType: [],
      casesOnAppealByMonth: [],
    },
    fiscalYearCaseStats: {
      casesClosedByMonth: [],
      casesClosedByProcedureType: [],
      casesOnAppealByMonth: [],
    },
    year: '2026',
    fiscalYear: '2027',
  };

  const emptyTabState = () => ({
    cases: { data: undefined, status: 'loaded' },
    petitions: { data: undefined, status: 'loaded' },
  });

  let getClerkDashboardCasesStatsInteractor: jest.Mock;
  let getClerkDashboardPetitionsStatsInteractor: jest.Mock;

  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;

    getClerkDashboardCasesStatsInteractor = jest
      .fn()
      .mockResolvedValue(mockCasesStats);
    getClerkDashboardPetitionsStatsInteractor = jest
      .fn()
      .mockResolvedValue(mockPetitionsStats);
    applicationContext.getUseCases = () =>
      ({
        getClerkDashboardCasesStatsInteractor,
        getClerkDashboardPetitionsStatsInteractor,
      }) as unknown as ReturnType<typeof applicationContext.getUseCases>;
  });

  it('should set the petitions tab data from the petitions endpoint and mark only that tab as loaded', async () => {
    const { state } = await runAction(
      setClerkOfCourtDashboardChartsAction('petitions'),
      {
        modules: { presenter },
        state: {
          clerkOfCourtDashboardStats: {
            cases: { data: undefined, status: 'loading' },
            petitions: { data: undefined, status: 'error' },
          },
        },
      },
    );

    expect(getClerkDashboardPetitionsStatsInteractor).toHaveBeenCalled();
    expect(getClerkDashboardCasesStatsInteractor).not.toHaveBeenCalled();
    expect(state.clerkOfCourtDashboardStats.petitions).toEqual({
      data: mockPetitionsStats,
      status: 'loaded',
    });
    expect(state.clerkOfCourtDashboardStats.cases.status).toEqual('loading');
  });

  it('should set the cases tab data from the cases endpoint and mark only that tab as loaded', async () => {
    const { state } = await runAction(
      setClerkOfCourtDashboardChartsAction('cases'),
      {
        modules: { presenter },
        state: {
          clerkOfCourtDashboardStats: {
            cases: { data: undefined, status: 'error' },
            petitions: { data: undefined, status: 'loading' },
          },
        },
      },
    );

    expect(getClerkDashboardCasesStatsInteractor).toHaveBeenCalled();
    expect(getClerkDashboardPetitionsStatsInteractor).not.toHaveBeenCalled();
    expect(state.clerkOfCourtDashboardStats.cases).toEqual({
      data: mockCasesStats,
      status: 'loaded',
    });
    expect(state.clerkOfCourtDashboardStats.petitions.status).toEqual(
      'loading',
    );
  });

  it('should mark the tab as loading while its stats are requested', async () => {
    let statusDuringRequest;
    getClerkDashboardCasesStatsInteractor.mockImplementation(() => {
      statusDuringRequest =
        presenter.state?.clerkOfCourtDashboardStats?.cases?.status;
      return Promise.resolve(mockCasesStats);
    });

    await runAction(setClerkOfCourtDashboardChartsAction('cases'), {
      modules: { presenter },
      state: { clerkOfCourtDashboardStats: emptyTabState() },
    });

    expect(statusDuringRequest).toEqual('loading');
  });

  it('should log an error from the interactor and mark only that tab as errored', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    getClerkDashboardCasesStatsInteractor.mockRejectedValue(
      'Failed getting stats',
    );

    const { state } = await runAction(
      setClerkOfCourtDashboardChartsAction('cases'),
      {
        modules: { presenter },
        state: {
          clerkOfCourtDashboardStats: {
            cases: { data: mockCasesStats, status: 'loaded' },
            petitions: { data: mockPetitionsStats, status: 'loaded' },
          },
        },
      },
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'setClerkOfCourtDashboardChartsAction(cases) failed:',
      'Failed getting stats',
    );
    expect(state.clerkOfCourtDashboardStats.cases.status).toEqual('error');
    expect(state.clerkOfCourtDashboardStats.cases.data).toEqual(mockCasesStats);
    expect(state.clerkOfCourtDashboardStats.petitions.status).toEqual('loaded');
    expect(state.alertError).toBeUndefined();
    consoleErrorSpy.mockRestore();
  });

  describe('when a newer load of a tab starts before an older one completes', () => {
    const newerStats = { ...mockCasesStats, year: '2027' };

    const deferred = <T>() => {
      let resolve!: (value: T) => void;
      let reject!: (reason: unknown) => void;
      const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, reject, resolve };
    };

    const startTwoLoads = () => {
      const older = deferred<ClerkDashboardCasesTabStats>();
      const newer = deferred<ClerkDashboardCasesTabStats>();
      getClerkDashboardCasesStatsInteractor
        .mockReturnValueOnce(older.promise)
        .mockReturnValueOnce(newer.promise);

      const run = () =>
        runAction(setClerkOfCourtDashboardChartsAction('cases'), {
          modules: { presenter },
          state: { clerkOfCourtDashboardStats: emptyTabState() },
        });
      // the older load starts first, so the newer one is the latest
      const olderRun = run();
      const newerRun = run();
      return { newer, newerRun, older, olderRun };
    };

    it('should ignore the older success when the newer load completes first', async () => {
      const { newer, newerRun, older, olderRun } = startTwoLoads();

      newer.resolve(newerStats);
      const { state: newerState } = await newerRun;
      older.resolve(mockCasesStats);
      const { state: olderState } = await olderRun;

      expect(newerState.clerkOfCourtDashboardStats.cases).toEqual({
        data: newerStats,
        status: 'loaded',
      });
      expect(olderState.clerkOfCourtDashboardStats.cases).toEqual({
        data: undefined,
        status: 'loading',
      });
    });

    it('should ignore the older failure when the newer load completes first', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const { newer, newerRun, older, olderRun } = startTwoLoads();

      newer.resolve(newerStats);
      const { state: newerState } = await newerRun;
      older.reject('Failed getting stats');
      const { state: olderState } = await olderRun;

      expect(newerState.clerkOfCourtDashboardStats.cases.status).toEqual(
        'loaded',
      );
      expect(olderState.clerkOfCourtDashboardStats.cases.status).toEqual(
        'loading',
      );
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it('should not ignore a load of the other tab', async () => {
      const { newer, newerRun, older, olderRun } = startTwoLoads();

      const { state: petitionsState } = await runAction(
        setClerkOfCourtDashboardChartsAction('petitions'),
        {
          modules: { presenter },
          state: { clerkOfCourtDashboardStats: emptyTabState() },
        },
      );
      newer.resolve(newerStats);
      older.resolve(mockCasesStats);
      const [{ state: newerState }] = await Promise.all([newerRun, olderRun]);

      expect(petitionsState.clerkOfCourtDashboardStats.petitions).toEqual({
        data: mockPetitionsStats,
        status: 'loaded',
      });
      // the petitions load started last, so this fails if the tabs share one request counter
      expect(newerState.clerkOfCourtDashboardStats.cases).toEqual({
        data: newerStats,
        status: 'loaded',
      });
    });
  });
});
