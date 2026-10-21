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
    calendarYearCaseStats: {
      casesClosedByMonth: [],
      casesClosedByProcedureType: [],
      casesOnAppealByMonth: [],
      openCasesByCaseType: [],
      openCasesByProcedureType: [],
    },
    fiscalYearCaseStats: {
      casesClosedByMonth: [],
      casesClosedByProcedureType: [],
      casesOnAppealByMonth: [],
      openCasesByCaseType: [],
      openCasesByProcedureType: [],
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
});
