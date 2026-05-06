import { ClerkDashboardStats } from '@web-api/persistence/postgres/cases/reports/getClerkDashboardStats';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setClerkOfCourtDashboardChartsAction } from './setClerkOfCourtDashboardChartsAction';

describe('setClerkOfCourtDashboardChartsAction', () => {
  const mockStats: ClerkDashboardStats = {
    caseTypeByQuarter: [
      { caseType: 'Deficiency', count: 120, quarter: 1 },
      { caseType: 'Deficiency', count: 145, quarter: 2 },
      { caseType: 'Lien/Levy', count: 85, quarter: 1 },
      { caseType: 'Lien/Levy', count: 92, quarter: 2 },
    ],
    casesFiledByMonth: Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      regular: i < 6 ? 55 : 0,
      small: i < 6 ? 40 : 0,
    })),
    closedCasesByMonth: Array.from({ length: 12 }, (_, i) => ({
      closed: i < 6 ? 130 : 0,
      closedDismissed: i < 6 ? 8 : 0,
      month: i + 1,
    })),
    petitionsByMonth: Array.from({ length: 12 }, (_, i) => ({
      electronic: i < 6 ? 1000 : 0,
      month: i + 1,
      paper: i < 6 ? 50 : 0,
    })),
    proceedingTypeCounts: [
      { count: 75, proceedingType: 'In Person' },
      { count: 25, proceedingType: 'Remote' },
    ],
    sessionTypeCounts: [
      { count: 40, sessionType: 'Regular' },
      { count: 10, sessionType: 'Small' },
      { count: 8, sessionType: 'Hybrid' },
    ],
    specialSessionsByLocation: [
      { count: 9, trialLocation: 'Atlanta, GA' },
      { count: 5, trialLocation: 'Denver, CO' },
    ],
    year: 2026,
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

  it('should set petitionsByMonth datasets with electronic and paper series', async () => {
    const { state } = await runAction(setClerkOfCourtDashboardChartsAction, {
      modules: { presenter },
      state: { clerkOfCourtDashboard: {} },
    });

    expect(state.clerkOfCourtDashboard.petitionsByMonthDatasets).toHaveLength(
      2,
    );
    expect(state.clerkOfCourtDashboard.petitionsByMonthDatasets[0].label).toBe(
      'Electronic',
    );
    expect(state.clerkOfCourtDashboard.petitionsByMonthDatasets[1].label).toBe(
      'Paper',
    );
  });

  it('should set closedCases datasets with closed and closed-dismissed series', async () => {
    const { state } = await runAction(setClerkOfCourtDashboardChartsAction, {
      modules: { presenter },
      state: { clerkOfCourtDashboard: {} },
    });

    expect(state.clerkOfCourtDashboard.closedCasesDatasets).toHaveLength(2);
    expect(state.clerkOfCourtDashboard.closedCasesDatasets[0].label).toBe(
      'Closed',
    );
    expect(state.clerkOfCourtDashboard.closedCasesDatasets[1].label).toBe(
      'Closed - Dismissed',
    );
  });

  it('should set casesFiledDatasets with Regular and Small Tax Cases series', async () => {
    const { state } = await runAction(setClerkOfCourtDashboardChartsAction, {
      modules: { presenter },
      state: { clerkOfCourtDashboard: {} },
    });

    expect(state.clerkOfCourtDashboard.casesFiledDatasets).toHaveLength(2);
    expect(state.clerkOfCourtDashboard.casesFiledDatasets[0].label).toBe(
      'Regular Cases',
    );
    expect(state.clerkOfCourtDashboard.casesFiledDatasets[1].label).toBe(
      'Small Tax Cases',
    );
  });

  it('should pivot caseTypeByQuarter into per-caseType datasets', async () => {
    const { state } = await runAction(setClerkOfCourtDashboardChartsAction, {
      modules: { presenter },
      state: { clerkOfCourtDashboard: {} },
    });

    const labels = state.clerkOfCourtDashboard.caseTypeBreakdownDatasets.map(
      (d: { label: string }) => d.label,
    );
    expect(labels).toContain('Deficiency');
    expect(labels).toContain('Lien/Levy');
  });

  it('should set proceeding type pie data as percentages', async () => {
    const { state } = await runAction(setClerkOfCourtDashboardChartsAction, {
      modules: { presenter },
      state: { clerkOfCourtDashboard: {} },
    });

    const total = state.clerkOfCourtDashboard.procedureTypePieData.reduce(
      (sum: number, d: { value: number }) => sum + d.value,
      0,
    );
    expect(total).toBe(100);
  });

  it('should set specialSessionsByLocation from API data', async () => {
    const { state } = await runAction(setClerkOfCourtDashboardChartsAction, {
      modules: { presenter },
      state: { clerkOfCourtDashboard: {} },
    });

    expect(state.clerkOfCourtDashboard.specialSessionsByLocation).toHaveLength(
      2,
    );
    expect(state.clerkOfCourtDashboard.specialSessionsByLocation[0].label).toBe(
      'Atlanta, GA',
    );
  });

  it('should set totalSessionsScheduled to the sum of all session type counts', async () => {
    const { state } = await runAction(setClerkOfCourtDashboardChartsAction, {
      modules: { presenter },
      state: { clerkOfCourtDashboard: {} },
    });

    expect(state.clerkOfCourtDashboard.totalSessionsScheduled).toBe(58); // 40 + 10 + 8
  });
});
