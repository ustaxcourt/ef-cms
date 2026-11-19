import type { ClerkDashboardCasesTabStats } from '@web-api/business/useCases/reports/clerkDashboardStats';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { get } from '../requests';

export const getClerkDashboardCasesStatsInteractor = (
  applicationContext: ClientApplicationContext,
): Promise<ClerkDashboardCasesTabStats> => {
  return get({
    applicationContext,
    endpoint: '/reports/clerk-dashboard-stats/cases',
  });
};
