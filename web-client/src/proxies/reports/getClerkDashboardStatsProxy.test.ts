jest.mock('../requests', () => ({
  get: jest.fn(),
}));

import { ClerkDashboardStats } from '@web-api/persistence/postgres/cases/reports/getClerkDashboardStats';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { get } from '../requests';
import { getClerkDashboardStatsInteractor } from './getClerkDashboardStatsProxy';

describe('getClerkDashboardStatsInteractor', () => {
  const mockStats: ClerkDashboardStats = {
    caseTypeByQuarter: [],
    casesFiledByMonth: [],
    closedCasesByMonth: [],
    petitionsByMonth: [],
    proceedingTypeCounts: [],
    sessionTypeCounts: [],
    specialSessionsByLocation: [],
    year: 2026,
  };

  beforeEach(() => {
    jest.mocked(get).mockResolvedValue(mockStats);
  });

  it('calls GET /reports/clerk-dashboard-stats with year when provided', async () => {
    await getClerkDashboardStatsInteractor(applicationContext, { year: 2025 });

    expect(get).toHaveBeenCalledWith({
      applicationContext,
      endpoint: '/reports/clerk-dashboard-stats',
      params: { year: 2025 },
    });
  });

  it('omits year from request params when not provided', async () => {
    await getClerkDashboardStatsInteractor(applicationContext);

    expect(get).toHaveBeenCalledWith({
      applicationContext,
      endpoint: '/reports/clerk-dashboard-stats',
      params: {},
    });
  });
});
