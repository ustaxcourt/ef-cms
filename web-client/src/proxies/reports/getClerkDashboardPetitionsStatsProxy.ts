import type { ClerkDashboardPetitionsTabStats } from '@web-api/business/useCases/reports/clerkDashboardStats';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { get } from '../requests';

export const getClerkDashboardPetitionsStatsInteractor = (
  applicationContext: ClientApplicationContext,
): Promise<ClerkDashboardPetitionsTabStats> => {
  return get({
    applicationContext,
    endpoint: '/reports/clerk-dashboard-stats/petitions',
  });
};
