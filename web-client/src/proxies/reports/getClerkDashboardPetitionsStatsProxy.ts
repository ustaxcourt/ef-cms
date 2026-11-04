import type { ClerkDashboardPetitionsTabStats } from '@web-api/business/useCases/reports/clerkDashboardStats';
import { get } from '../requests';

export const getClerkDashboardPetitionsStatsInteractor = (
  applicationContext,
): Promise<ClerkDashboardPetitionsTabStats> => {
  return get({
    applicationContext,
    endpoint: '/reports/clerk-dashboard-stats/petitions',
  });
};
