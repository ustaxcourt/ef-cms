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
    year: '2026',
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

  it('should set clerkOfCourtDashboardStats in state', async () => {
    const { state } = await runAction(setClerkOfCourtDashboardChartsAction, {
      modules: { presenter },
      state: { clerkOfCourtDashboard: {} },
    });

    expect(state.clerkOfCourtDashboardStats).toEqual(mockStats);
  });

  it('should log an error from the interactor', async () => {
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
      state: { clerkOfCourtDashboard: {} },
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'setClerkOfCourtDashboardChartsAction failed:',
      'Failed getting stats',
    );
    expect(state.clerkOfCourtDashboardStats).toEqual({
      year: '',
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
