import { ClerkDashboardStats } from '@web-api/persistence/postgres/cases/reports/getClerkDashboardStats';
import { getClerkDashboardStatsInteractor } from './getClerkDashboardStatsInteractor';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

jest.mock(
  '@web-api/persistence/postgres/cases/reports/getClerkDashboardStats',
  () => ({
    getClerkDashboardStats: jest.fn(),
  }),
);

import { getClerkDashboardStats } from '@web-api/persistence/postgres/cases/reports/getClerkDashboardStats';

describe('getClerkDashboardStatsInteractor', () => {
  const mockStats: ClerkDashboardStats = {
    caseTypeByQuarter: [{ caseType: 'Deficiency', count: 42, quarter: 1 }],
    casesFiledByMonth: Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      regular: 10,
      small: 5,
    })),
    closedCasesByMonth: Array.from({ length: 12 }, (_, i) => ({
      closed: 8,
      closedDismissed: 2,
      month: i + 1,
    })),
    petitionsByMonth: Array.from({ length: 12 }, (_, i) => ({
      electronic: 100,
      month: i + 1,
      paper: 20,
    })),
    proceedingTypeCounts: [
      { count: 75, proceedingType: 'In Person' },
      { count: 25, proceedingType: 'Remote' },
    ],
    sessionTypeCounts: [
      { count: 40, sessionType: 'Regular' },
      { count: 10, sessionType: 'Small' },
    ],
    specialSessionsByLocation: [
      { count: 9, trialLocation: 'Atlanta, GA' },
      { count: 5, trialLocation: 'Denver, CO' },
    ],
    year: 2026,
  };

  beforeEach(() => {
    (getClerkDashboardStats as jest.Mock).mockResolvedValue(mockStats);
  });

  it('should throw an unauthorized error when the user does not have access', async () => {
    await expect(
      getClerkDashboardStatsInteractor({ year: 2026 }, mockPetitionerUser),
    ).rejects.toThrow('Unauthorized');
  });

  it('should return clerk dashboard stats for an authorized user', async () => {
    const result = await getClerkDashboardStatsInteractor(
      { year: 2026 },
      mockDocketClerkUser,
    );

    expect(result).toEqual(mockStats);
  });

  it('should call getClerkDashboardStats with the provided year', async () => {
    await getClerkDashboardStatsInteractor({ year: 2025 }, mockDocketClerkUser);

    expect(getClerkDashboardStats).toHaveBeenCalledWith({ year: 2025 });
  });
});
