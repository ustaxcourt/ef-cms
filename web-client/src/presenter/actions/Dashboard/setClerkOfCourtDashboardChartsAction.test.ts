import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setClerkOfCourtDashboardChartsAction } from './setClerkOfCourtDashboardChartsAction';
import { ClerkDashboardStats } from '@web-api/business/useCases/reports/getClerkDashboardStatsInteractor';

describe('setClerkOfCourtDashboardChartsAction', () => {
  const mockStats: ClerkDashboardStats = {
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

  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext.getUseCases = () =>
      ({
        getClerkDashboardStatsInteractor: jest
          .fn()
          .mockResolvedValue(mockStats),
      }) as unknown as ReturnType<typeof applicationContext.getUseCases>;
  });

  it('should set clerkOfCourtDashboardStats in state and mark the charts as loaded', async () => {
    const { state } = await runAction(setClerkOfCourtDashboardChartsAction, {
      modules: { presenter },
      state: {
        clerkOfCourtDashboard: {},
        clerkOfCourtDashboardStatsStatus: 'error',
      },
    });

    expect(state.clerkOfCourtDashboardStats).toEqual(mockStats);
    expect(state.clerkOfCourtDashboardStatsStatus).toEqual('loaded');
  });

  it('should mark the charts as loading while the stats are requested', async () => {
    let statusDuringRequest;
    applicationContext.getUseCases = () =>
      ({
        getClerkDashboardStatsInteractor: jest.fn().mockImplementation(() => {
          statusDuringRequest =
            presenter.state?.clerkOfCourtDashboardStatsStatus;
          return Promise.resolve(mockStats);
        }),
      }) as unknown as ReturnType<typeof applicationContext.getUseCases>;

    await runAction(setClerkOfCourtDashboardChartsAction, {
      modules: { presenter },
      state: { clerkOfCourtDashboardStatsStatus: 'loaded' },
    });

    expect(statusDuringRequest).toEqual('loading');
  });

  it('should log an error from the interactor and mark the charts as errored', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    applicationContext.getUseCases = () =>
      ({
        getClerkDashboardStatsInteractor: jest
          .fn()
          .mockRejectedValue('Failed getting stats'),
      }) as unknown as ReturnType<typeof applicationContext.getUseCases>;

    const { state } = await runAction(setClerkOfCourtDashboardChartsAction, {
      modules: { presenter },
      state: {
        clerkOfCourtDashboardStats: {
          year: '',
          fiscalYear: '',
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
        },
      },
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'setClerkOfCourtDashboardChartsAction failed:',
      'Failed getting stats',
    );
    expect(state.clerkOfCourtDashboardStatsStatus).toEqual('error');
    expect(state.alertError).toBeUndefined();
    expect(state.clerkOfCourtDashboardStats).toEqual({
      year: '',
      fiscalYear: '',
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
    });
  });

  describe('when a newer load starts before an older one completes', () => {
    const newerStats = { ...mockStats, year: '2027' };

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
      const older = deferred<ClerkDashboardStats>();
      const newer = deferred<ClerkDashboardStats>();
      const getClerkDashboardStatsInteractor = jest
        .fn()
        .mockReturnValueOnce(older.promise)
        .mockReturnValueOnce(newer.promise);
      applicationContext.getUseCases = () =>
        ({ getClerkDashboardStatsInteractor }) as unknown as ReturnType<
          typeof applicationContext.getUseCases
        >;

      const run = () =>
        runAction(setClerkOfCourtDashboardChartsAction, {
          modules: { presenter },
          state: { clerkOfCourtDashboardStatsStatus: 'loaded' },
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
      older.resolve(mockStats);
      const { state: olderState } = await olderRun;

      expect(newerState.clerkOfCourtDashboardStats).toEqual(newerStats);
      expect(newerState.clerkOfCourtDashboardStatsStatus).toEqual('loaded');
      expect(olderState.clerkOfCourtDashboardStats).toBeUndefined();
      expect(olderState.clerkOfCourtDashboardStatsStatus).toEqual('loading');
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

      expect(newerState.clerkOfCourtDashboardStatsStatus).toEqual('loaded');
      expect(olderState.clerkOfCourtDashboardStatsStatus).toEqual('loading');
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });
});
