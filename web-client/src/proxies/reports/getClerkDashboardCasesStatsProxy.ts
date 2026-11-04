import type { ClerkDashboardCasesTabStats } from '@web-api/business/useCases/reports/clerkDashboardStats';
import { get } from '../requests';

export const getClerkDashboardCasesStatsInteractor = (
  applicationContext,
): Promise<ClerkDashboardCasesTabStats> => {
  return get({
    applicationContext,
    endpoint: '/reports/clerk-dashboard-stats/cases',
  });
};
